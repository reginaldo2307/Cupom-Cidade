-- ############################################################
-- CIDADE CUPONS - ESTRUTURA DE BANCO DE DADOS (SUPABASE/POSTGRES)
-- ############################################################

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ############################################################
-- 1. TABELA: PLANS
-- ############################################################
CREATE TABLE public.plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    price_monthly NUMERIC(10, 2) NOT NULL DEFAULT 0,
    price_yearly NUMERIC(10, 2) NOT NULL DEFAULT 0,
    max_coupons INTEGER NOT NULL DEFAULT 1,
    max_highlighted_coupons INTEGER NOT NULL DEFAULT 0,
    has_stats BOOLEAN NOT NULL DEFAULT FALSE,
    priority_support BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Inserir planos iniciais
INSERT INTO public.plans (name, price_monthly, price_yearly, max_coupons, max_highlighted_coupons, has_stats, priority_support)
VALUES 
('Plano Gratuito', 0.00, 0.00, 1, 0, FALSE, FALSE),
('Plano Profissional', 49.90, 499.00, 10, 2, TRUE, FALSE),
('Plano Premium', 99.90, 999.00, 9999, 10, TRUE, TRUE);

-- ############################################################
-- 2. TABELA: PROFILES (Extende auth.users)
-- ############################################################
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    company_name TEXT NOT NULL,
    responsible_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'company' CHECK (role IN ('admin', 'company')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ############################################################
-- 3. TABELA: SUBSCRIPTIONS
-- ############################################################
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.plans(id),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'canceled', 'expired', 'pending')),
    billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    payment_provider TEXT,
    payment_id TEXT,
    mercado_pago_subscription_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraint: Apenas uma assinatura ativa por usuário
    CONSTRAINT unique_active_subscription UNIQUE (user_id, status) 
);
-- Nota: A constraint acima é simplificada. No Postgres real, costuma-se usar um índice parcial para garantir apenas um 'active'.
CREATE UNIQUE INDEX idx_one_active_subscription ON public.subscriptions (user_id) WHERE (status = 'active');

-- ############################################################
-- 4. TABELA: CATEGORIES
-- ############################################################
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Inserir algumas categorias padrão
INSERT INTO public.categories (name, slug) VALUES 
('Alimentação', 'alimentacao'),
('Saúde', 'saude'),
('Beleza', 'beleza'),
('Educação', 'educacao'),
('Serviços', 'servicos');

-- ############################################################
-- 5. TABELA: COUPONS
-- ############################################################
CREATE TABLE public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id),
    title TEXT NOT NULL,
    description TEXT,
    coupon_code TEXT NOT NULL,
    image_url TEXT,
    expiration_date TIMESTAMPTZ NOT NULL,
    is_highlighted BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'paused')),
    clicks_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ############################################################
-- 6. TABELA: CLICKS
-- ############################################################
CREATE TABLE public.clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
    user_agent TEXT,
    ip_address TEXT,
    clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ############################################################
-- ÍNDICES PARA PERFORMANCE
-- ############################################################
CREATE INDEX idx_coupons_user_id ON public.coupons(user_id);
CREATE INDEX idx_coupons_category_id ON public.coupons(category_id);
CREATE INDEX idx_coupons_status ON public.coupons(status);
CREATE INDEX idx_coupons_expiration ON public.coupons(expiration_date);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_clicks_coupon_id ON public.clicks(coupon_id);

-- ############################################################
-- FUNÇÕES E TRIGGERS
-- ############################################################

-- 1. Trigger para incrementar cliques automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_click()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.coupons
    SET clicks_count = clicks_count + 1
    WHERE id = NEW.coupon_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_click_inserted
AFTER INSERT ON public.clicks
FOR EACH ROW EXECUTE FUNCTION public.handle_new_click();

-- 2. Função para validar limites de plano (Cupons Totais e Destacados)
CREATE OR REPLACE FUNCTION public.validate_coupon_limits()
RETURNS TRIGGER AS $$
DECLARE
    v_plan_max_coupons INTEGER;
    v_plan_max_highlighted INTEGER;
    v_current_coupons INTEGER;
    v_current_highlighted INTEGER;
BEGIN
    -- Buscar limites do plano ativo do usuário
    SELECT p.max_coupons, p.max_highlighted_coupons
    INTO v_plan_max_coupons, v_plan_max_highlighted
    FROM public.subscriptions s
    JOIN public.plans p ON s.plan_id = p.id
    WHERE s.user_id = NEW.user_id AND s.status = 'active'
    LIMIT 1;

    -- Se não tiver assinatura ativa, assume limites do plano gratuito (ou bloqueia)
    IF v_plan_max_coupons IS NULL THEN
        RAISE EXCEPTION 'Usuário não possui uma assinatura ativa.';
    END IF;

    -- Validar limite total de cupons (apenas no INSERT)
    IF (TG_OP = 'INSERT') THEN
        SELECT COUNT(*) INTO v_current_coupons FROM public.coupons WHERE user_id = NEW.user_id;
        IF v_current_coupons >= v_plan_max_coupons THEN
            RAISE EXCEPTION 'Limite de cupons do seu plano atingido (% de %).', v_current_coupons, v_plan_max_coupons;
        END IF;
    END IF;

    -- Validar limite de destaques (INSERT ou UPDATE se is_highlighted mudar para true)
    IF (NEW.is_highlighted = TRUE AND (TG_OP = 'INSERT' OR OLD.is_highlighted = FALSE)) THEN
        SELECT COUNT(*) INTO v_current_highlighted FROM public.coupons WHERE user_id = NEW.user_id AND is_highlighted = TRUE;
        IF v_current_highlighted >= v_plan_max_highlighted THEN
            RAISE EXCEPTION 'Limite de cupons destacados atingido (% de %).', v_current_highlighted, v_plan_max_highlighted;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER before_coupon_insert_update
BEFORE INSERT OR UPDATE ON public.coupons
FOR EACH ROW EXECUTE FUNCTION public.validate_coupon_limits();

-- 3. Função para expirar assinaturas (Pode ser chamada via Cron ou Edge Function)
CREATE OR REPLACE FUNCTION public.expire_subscriptions()
RETURNS void AS $$
BEGIN
    UPDATE public.subscriptions
    SET status = 'expired'
    WHERE status = 'active' AND end_date < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ############################################################
-- ROW LEVEL SECURITY (RLS)
-- ############################################################

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS: PROFILES
CREATE POLICY "Usuários podem ver seu próprio perfil" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- POLÍTICAS: SUBSCRIPTIONS
CREATE POLICY "Usuários podem ver suas próprias assinaturas" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- POLÍTICAS: COUPONS
CREATE POLICY "Qualquer um pode ver cupons ativos" ON public.coupons
    FOR SELECT USING (status = 'active');

CREATE POLICY "Usuários podem gerenciar seus próprios cupons" ON public.coupons
    FOR ALL USING (auth.uid() = user_id);

-- POLÍTICAS: CLICKS
CREATE POLICY "Dono do cupom pode ver cliques" ON public.clicks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.coupons 
            WHERE coupons.id = clicks.coupon_id 
            AND coupons.user_id = auth.uid()
        )
    );

CREATE POLICY "Qualquer um pode inserir cliques" ON public.clicks
    FOR INSERT WITH CHECK (TRUE);

-- POLÍTICAS: CATEGORIES
CREATE POLICY "Qualquer um pode ver categorias" ON public.categories
    FOR SELECT USING (is_active = TRUE);

-- POLÍTICA GLOBAL PARA ADMINS (Exemplo)
-- Nota: Requer que o campo 'role' no profile seja 'admin'
CREATE POLICY "Admins podem tudo" ON public.profiles FOR ALL USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
-- Aplicar lógica similar para outras tabelas se necessário

-- ############################################################
-- VIEW: USER DASHBOARD STATS
-- ############################################################
CREATE OR REPLACE VIEW public.user_dashboard_stats AS
SELECT 
    u.id as user_id,
    COUNT(c.id) as total_coupons,
    SUM(c.clicks_count) as total_clicks,
    COUNT(c.id) FILTER (WHERE c.status = 'active') as active_coupons
FROM public.profiles u
LEFT JOIN public.coupons c ON u.id = c.user_id
GROUP BY u.id;

-- ############################################################
-- RPC: GET CLICK HISTORY
-- ############################################################
CREATE OR REPLACE FUNCTION public.get_click_history(p_user_id UUID)
RETURNS TABLE (day DATE, count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        date(cl.clicked_at) as day, 
        COUNT(*) as count
    FROM public.clicks cl
    JOIN public.coupons co ON cl.coupon_id = co.id
    WHERE co.user_id = p_user_id
    GROUP BY day
    ORDER BY day DESC
    LIMIT 7;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ############################################################
-- TRIGGER PARA CRIAR PROFILE AUTOMATICAMENTE NO SIGNUP
-- ############################################################
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, company_name, responsible_name, role)
    VALUES (
        NEW.id, 
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'company_name', 'Minha Empresa'), 
        COALESCE(NEW.raw_user_meta_data->>'responsible_name', 'Responsável'),
        'company'
    );
    
    -- Opcional: Criar assinatura gratuita inicial
    INSERT INTO public.subscriptions (user_id, plan_id, status, billing_cycle)
    SELECT NEW.id, id, 'active', 'monthly'
    FROM public.plans WHERE name = 'Plano Gratuito' LIMIT 1;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
