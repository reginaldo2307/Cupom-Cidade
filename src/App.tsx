/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Ticket, 
  PlusCircle, 
  BarChart3, 
  CreditCard, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Search, 
  Bell, 
  ArrowUpRight,
  CheckCircle2,
  Store,
  Users,
  HelpCircle,
  Menu,
  X,
  ArrowRight,
  Smartphone,
  ShieldCheck,
  Zap,
  TrendingUp,
  Mail,
  Lock,
  Facebook,
  Instagram,
  Globe,
  MoreVertical,
  Trash2,
  Edit2,
  Calendar,
  Tag,
  Coffee,
  Utensils,
  Dumbbell,
  ShoppingBag,
  Sparkles,
  Upload,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Page, Coupon, Stats } from './types';
import { api } from './services/api';

// --- Components ---

const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const variants: any = {
    primary: 'bg-primary text-white hover:bg-blue-700 shadow-lg shadow-primary/20',
    secondary: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50',
    outline: 'border border-primary text-primary hover:bg-primary/5',
    ghost: 'text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary',
    success: 'bg-success text-white hover:bg-emerald-600 shadow-lg shadow-success/20',
  };

  return (
    <button 
      className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }: any) => (
  <div className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm ${className}`}>
    {children}
  </div>
);

const Input = ({ label, icon: Icon, ...props }: any) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>}
    <div className="relative group">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
          <Icon size={18} />
        </div>
      )}
      <input 
        className={`block w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400`}
        {...props}
      />
    </div>
  </div>
);

// --- Pages ---

const LandingPage = ({ onNavigate }: { onNavigate: (p: Page) => void }) => {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Ticket className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight">Cidade<span className="text-primary">Cupons</span></span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {['Recursos', 'Como Funciona', 'Preços', 'FAQ'].map(item => (
                <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">{item}</a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => onNavigate('login')} className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-primary">Login</button>
              <Button onClick={() => onNavigate('register')}>Criar Conta Grátis</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-2xl"
            >
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-6">
                <Sparkles size={14} className="mr-2" /> Novidade: Integração com WhatsApp
              </span>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.1] mb-6">
                Aumente suas vendas com <span className="text-primary">cupons digitais</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                A plataforma completa para comércios locais criarem, gerenciarem e rastrearem campanhas de desconto em minutos. Transforme visitantes em clientes fiéis hoje mesmo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => onNavigate('register')} className="px-8 py-4 text-lg">
                  Começar Agora <ArrowRight size={20} />
                </Button>
                <Button variant="secondary" className="px-8 py-4 text-lg">
                  Ver Demonstração
                </Button>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/20 blur-3xl rounded-full"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-success/20 blur-3xl rounded-full"></div>
              <Card className="p-4 relative z-10">
                <img 
                  src="https://picsum.photos/seed/dashboard/800/600" 
                  alt="Dashboard Preview" 
                  className="rounded-xl w-full"
                  referrerPolicy="no-referrer"
                />
              </Card>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Social Proof */}
      <section className="py-12 border-y border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-center">
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">Empresas que confiam na Cidade Cupons</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale">
          {[
            { icon: Store, name: 'MERKADO' },
            { icon: Coffee, name: 'COFFEE_CO' },
            { icon: Utensils, name: 'FOOD_HUB' },
            { icon: Dumbbell, name: 'GYM_MAX' }
          ].map(brand => (
            <span key={brand.name} className="text-2xl font-bold flex items-center gap-2">
              <brand.icon size={24} /> {brand.name}
            </span>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section id="como-funciona" className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Como funciona em 3 passos</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Simples, rápido e eficiente. Comece a distribuir descontos em menos de 5 minutos.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { id: '01', title: 'Cadastre seu negócio', desc: 'Insira as informações básicas da sua loja e personalize seu perfil para os clientes.', icon: Store },
              { id: '02', title: 'Crie seu cupom', desc: 'Defina o valor do desconto, validade e regras de uso com poucos cliques.', icon: PlusCircle },
              { id: '03', title: 'Veja as vendas crescerem', desc: 'Acompanhe em tempo real quantos cupons foram resgatados e seu ROI total.', icon: TrendingUp }
            ].map(step => (
              <div key={step.id} className="relative group">
                <div className="mb-6 w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <step.icon size={32} />
                </div>
                <div className="absolute -top-4 -left-4 text-6xl font-black text-slate-100 dark:text-slate-800 -z-10">{step.id}</div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Ticket className="text-white" size={16} />
                </div>
                <span className="text-lg font-bold tracking-tight">Cidade<span className="text-primary">Cupons</span></span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-xs">Ajudando comércios locais a prosperarem através da tecnologia e marketing inteligente.</p>
              <div className="flex gap-4">
                {[Facebook, Instagram, Globe].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
            {['Produto', 'Suporte', 'Legal'].map(col => (
              <div key={col}>
                <h4 className="font-bold mb-6">{col}</h4>
                <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                  {['Link 1', 'Link 2', 'Link 3'].map(link => <li key={link}><a href="#" className="hover:text-primary">{link}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-slate-200 dark:border-slate-900 flex flex-col md:row items-center justify-between gap-4 text-sm text-slate-400">
            <p>© 2024 Cidade Cupons. Todos os direitos reservados.</p>
            <div className="flex items-center gap-2">
              <Store size={14} /> <span>Feito com ❤️ no Brasil</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const LoginPage = ({ onNavigate, onAuthSuccess }: { onNavigate: (p: Page) => void, onAuthSuccess: (u: any) => void }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userData = await api.login(email);
      onAuthSuccess(userData);
    } catch (err: any) {
      setError('Usuário não encontrado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary/10">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('https://picsum.photos/seed/shop/1200/1200')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent"></div>
        <div className="absolute bottom-12 left-12 right-12 z-10 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white p-2 rounded-lg text-primary">
              <Ticket size={24} />
            </div>
            <span className="text-2xl font-black tracking-tight">Cidade Cupons</span>
          </div>
          <h2 className="text-4xl font-bold leading-tight mb-4">Impulsione suas vendas locais com cupons inteligentes.</h2>
          <p className="text-lg text-white/90 max-w-md">Junte-se a centenas de lojistas que estão transformando clientes ocasionais em clientes fiéis.</p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-slate-900">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Acesse sua conta</h1>
            <p className="text-slate-500 dark:text-slate-400">Entre para gerenciar suas campanhas de cupons.</p>
          </div>
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-lg border border-red-100">{error}</div>}
            <Input 
              label="E-mail" 
              icon={Mail} 
              placeholder="seu@email.com" 
              type="email" 
              required 
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            />
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Senha</label>
                <a href="#" className="text-sm font-semibold text-primary hover:text-primary/80">Esqueceu a senha?</a>
              </div>
              <Input icon={Lock} placeholder="••••••••" type="password" required />
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer" />
              <label htmlFor="remember" className="ml-2 block text-sm text-slate-600 dark:text-slate-400 cursor-pointer">Manter conectado</label>
            </div>
            <Button type="submit" className="w-full py-4" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar na plataforma'}
            </Button>
          </form>
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-slate-600 dark:text-slate-400 text-sm">Ainda não tem uma conta? <button onClick={() => onNavigate('register')} className="font-bold text-primary hover:text-primary/80 ml-1">Criar conta grátis</button></p>
          </div>
        </div>
      </div>
    </div>
  );
};

const RegisterPage = ({ onNavigate, onAuthSuccess }: { onNavigate: (p: Page) => void, onAuthSuccess: (u: any) => void }) => {
  const [formData, setFormData] = useState({
    email: '',
    company_name: '',
    responsible_name: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await api.register(formData);
      onAuthSuccess(userData);
    } catch (err: any) {
      alert(err.message || 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 lg:px-20">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="text-primary size-8">
            <Ticket size={32} />
          </div>
          <h1 className="text-xl font-black tracking-tight">Cidade Cupons</h1>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hidden md:block text-sm font-medium hover:text-primary">Precisa de ajuda?</a>
          <button onClick={() => onNavigate('login')} className="text-sm font-bold text-primary">Entrar</button>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight mb-2">Crie sua conta de parceiro</h2>
            <p className="text-slate-500 dark:text-slate-400">Junte-se a centenas de empresas locais e comece a crescer hoje mesmo.</p>
          </div>
          <Card className="p-8">
            <div className="mb-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Passo 1 de 3</span>
                <span className="text-xs font-bold text-slate-400">Dados da Empresa</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-1/3"></div>
              </div>
            </div>
            <form className="space-y-6" onSubmit={handleRegister}>
              <div className="space-y-4">
                <Input 
                  label="Nome da Empresa" 
                  icon={Store} 
                  placeholder="Ex: Padaria Central" 
                  required 
                  value={formData.company_name}
                  onChange={(e: any) => setFormData({ ...formData, company_name: e.target.value })}
                />
                <Input 
                  label="Pessoa Responsável" 
                  icon={Users} 
                  placeholder="Nome completo" 
                  required 
                  value={formData.responsible_name}
                  onChange={(e: any) => setFormData({ ...formData, responsible_name: e.target.value })}
                />
              </div>
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Input 
                  label="E-mail Corporativo" 
                  icon={Mail} 
                  placeholder="contato@empresa.com.br" 
                  type="email" 
                  required 
                  value={formData.email}
                  onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                />
                <Input 
                  label="Telefone" 
                  icon={Smartphone} 
                  placeholder="(11) 99999-9999" 
                  required 
                  value={formData.phone}
                  onChange={(e: any) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full py-4" disabled={loading}>
                {loading ? 'Criando...' : 'Criar Minha Conta'}
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

const DashboardLayout = ({ children, activePage, onNavigate, user }: any) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col hidden lg:flex">
        <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="size-10 rounded-lg bg-primary flex items-center justify-center text-white">
            <Ticket size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">Cidade Cupons</h1>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Business Portal</p>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'coupons', label: 'Meus Cupons', icon: Ticket },
            { id: 'create-coupon', label: 'Criar Cupom', icon: PlusCircle },
            { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
            { id: 'billing', label: 'Assinatura', icon: CreditCard },
            { id: 'settings', label: 'Configurações', icon: Settings },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${activePage === item.id ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <item.icon size={20} className={activePage === item.id ? 'text-primary' : 'group-hover:text-primary'} />
              <span className="text-sm font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="size-9 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <img src={`https://picsum.photos/seed/${user?.id || 'user'}/100/100`} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate">{user?.responsible_name || 'Usuário'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.company_name || 'Minha Empresa'}</p>
            </div>
            <button onClick={() => { api.logout(); onNavigate('landing'); }} className="text-slate-400 hover:text-red-500"><LogOut size={16} /></button>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2">
            <Ticket className="text-primary" size={24} />
            <span className="font-bold">Cidade Cupons</span>
          </div>
          <button className="p-2 text-slate-600"><Menu size={24} /></button>
        </header>
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

const DashboardOverview = ({ onNavigate, user }: any) => {
  const [stats, setStats] = useState<any>(null);
  const [sub, setSub] = useState<any>(null);

  useEffect(() => {
    api.getStats().then(setStats);
    api.getMySubscription().then(setSub);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Olá, {user?.responsible_name?.split(' ')[0] || 'Parceiro'}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Bem-vindo de volta! Gerencie seus cupons com facilidade.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => onNavigate('create-coupon')}>
            <Zap size={18} /> Criação Rápida
          </Button>
          <div className="size-10 rounded-full border-2 border-primary/20 p-0.5">
            <img src="https://picsum.photos/seed/user/100/100" alt="User" className="size-full rounded-full object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total de Cupons', value: stats?.totalCoupons || 0, icon: Ticket, trend: '+12%', color: 'blue' },
          { label: 'Cliques Totais', value: stats?.totalClicks || 0, icon: Smartphone, trend: '+25%', color: 'purple' },
          { label: 'Cupons Ativos', value: stats?.activeCoupons || 0, icon: CheckCircle2, trend: '+2%', color: 'emerald' },
          { label: 'Plano Atual', value: sub?.plan_name || '...', icon: Sparkles, trend: sub ? `Limite: ${sub.max_coupons}` : '...', color: 'amber' },
        ].map(kpi => (
          <Card key={kpi.label} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={`size-10 bg-${kpi.color}-50 dark:bg-${kpi.color}-900/30 text-${kpi.color}-600 rounded-lg flex items-center justify-center`}>
                <kpi.icon size={20} />
              </div>
              <span className={`text-emerald-500 text-sm font-bold flex items-center`}>{kpi.trend}</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{kpi.label}</p>
            <p className="text-2xl font-bold mt-1">{kpi.value}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold">Engajamento de Cliques</h3>
            <p className="text-sm text-slate-500">Análise de desempenho nos últimos 7 dias</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs font-bold rounded bg-slate-100 dark:bg-slate-700">7 Dias</button>
            <button className="px-3 py-1.5 text-xs font-medium rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">30 Dias</button>
          </div>
        </div>
        <div className="h-64 flex items-end justify-between gap-2 pt-4">
          {stats?.clickHistory?.length > 0 ? (
            stats.clickHistory.map((item: any, i: number) => (
              <div key={i} className="flex-1 bg-primary/10 rounded-t-lg relative group">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.count / Math.max(...stats.clickHistory.map((h: any) => h.count))) * 100}%` }}
                  className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-lg group-hover:bg-blue-600 transition-colors"
                ></motion.div>
              </div>
            ))
          ) : (
            [40, 70, 45, 90, 65, 80, 50].map((h, i) => (
              <div key={i} className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-t-lg"></div>
            ))
          )}
        </div>
        <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {stats?.clickHistory?.length > 0 ? (
            stats.clickHistory.map((item: any, i: number) => (
              <span key={i}>{item.day.split('-').slice(2)}</span>
            ))
          ) : (
            <span>Sem dados</span>
          )}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold">Últimos Cupons Criados</h3>
          <button onClick={() => onNavigate('coupons')} className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
            Ver todos <ChevronRight size={16} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {stats?.latestCoupons?.length > 0 ? (
                stats.latestCoupons.map((item: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                          <Tag size={16} />
                        </div>
                        <span className="text-sm font-semibold">{item.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{item.clicks_count} cliques</td>
                    <td className="px-6 py-4 text-sm text-slate-400 text-right">{new Date(item.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400 italic">Nenhum cupom recente.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const CouponsPage = ({ onNavigate }: any) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    api.getMyCoupons().then(setCoupons);
  }, []);

  const deleteCoupon = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cupom?')) {
      api.deleteCoupon(id).then(() => {
        setCoupons(prev => prev.filter(c => c.id !== id));
      });
    }
  };

  const simulateClick = (id: string) => {
    api.trackClick(id).then(() => {
      setCoupons(prev => prev.map(c => c.id === id ? { ...c, clicks_count: c.clicks_count + 1 } : c));
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Meus Cupons</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Gerencie e acompanhe suas ofertas promocionais.</p>
        </div>
        <Button onClick={() => onNavigate('create-coupon')}>
          <PlusCircle size={18} /> Criar Novo Cupom
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary text-sm" placeholder="Buscar cupons..." type="text" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Cliques</th>
                <th className="px-6 py-4">Destaque</th>
                <th className="px-6 py-4">Expiração</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">Nenhum cupom encontrado.</td>
                </tr>
              ) : coupons.map(coupon => (
                <tr key={coupon.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                        <Tag size={16} />
                      </div>
                      <span className="font-semibold text-sm">{coupon.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${coupon.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                      <span className={`size-1.5 rounded-full ${coupon.status === 'active' ? 'bg-emerald-500' : 'bg-slate-500'}`}></span> {coupon.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{coupon.clicks_count}</td>
                  <td className="px-6 py-4">
                    {coupon.is_highlighted ? (
                      <span className="text-amber-500 flex items-center gap-1 text-xs font-bold">
                        <Sparkles size={14} /> Sim
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">Não</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">{new Date(coupon.expiration_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => simulateClick(coupon.id)} className="px-2 py-1 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 rounded hover:bg-primary hover:text-white transition-colors">Simular Clique</button>
                      <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-primary"><Edit2 size={16} /></button>
                      <button onClick={() => deleteCoupon(coupon.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const CreateCouponPage = ({ onNavigate }: any) => {
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    description: '',
    coupon_code: '',
    expiration_date: '',
    is_highlighted: false
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createCoupon(formData);
      onNavigate('coupons');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Criar Novo Cupom</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Configure os detalhes da sua oferta para atrair novos clientes locais.</p>
      </div>

      <Card className="p-8">
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <h3 className="text-lg font-semibold border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">Informações Básicas</h3>
            </div>
            <Input 
              label="Título do Cupom" 
              placeholder="Ex: 50% de desconto no 2º item" 
              value={formData.title}
              onChange={(e: any) => setFormData({ ...formData, title: e.target.value })}
              required 
            />
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Categoria</label>
              <select 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                value={formData.category_id}
                onChange={(e: any) => setFormData({ ...formData, category_id: e.target.value })}
                required
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2 space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Descrição Detalhada</label>
              <textarea 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                placeholder="Descreva as condições da oferta..."
                rows={3}
                value={formData.description}
                onChange={(e: any) => setFormData({ ...formData, description: e.target.value })}
                required
              ></textarea>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <h3 className="text-lg font-semibold border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">Regras & Validade</h3>
            </div>
            <Input 
              label="Código do Cupom" 
              placeholder="PIZZA50OFF" 
              value={formData.coupon_code}
              onChange={(e: any) => setFormData({ ...formData, coupon_code: e.target.value })}
              required 
            />
            <Input 
              label="Data de Expiração" 
              type="date" 
              value={formData.expiration_date}
              onChange={(e: any) => setFormData({ ...formData, expiration_date: e.target.value })}
              required 
            />
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="highlight" 
              className="size-4 text-primary rounded"
              checked={formData.is_highlighted}
              onChange={(e) => setFormData({ ...formData, is_highlighted: e.target.checked })}
            />
            <label htmlFor="highlight" className="text-sm font-semibold">Destacar este cupom (Requer plano Pro/Premium)</label>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">Mídia da Promoção</h3>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-10 bg-slate-50 dark:bg-slate-800/20 hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <Upload size={32} />
              </div>
              <p className="text-sm font-bold">Clique para fazer upload ou arraste uma imagem</p>
              <p className="text-xs text-slate-500 mt-1">SVG, PNG, JPG (Recomendado 1200x630px)</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-6">
            <Button variant="ghost" type="button" onClick={() => onNavigate('coupons')}>Cancelar</Button>
            <Button type="submit" variant="success" className="px-10" disabled={loading}>
              <Send size={18} /> {loading ? 'Publicando...' : 'Publicar Cupom'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

const BillingPage = () => {
  const [sub, setSub] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    api.getMySubscription().then(setSub);
    api.getPlans().then(setPlans);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Assinatura & Plano</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Gerencie seu plano e métodos de pagamento.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Sparkles size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Plano {sub?.plan_name || '...'}</h3>
                <p className="text-sm text-slate-500">Sua assinatura está ativa</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">{sub?.status || '...'}</span>
          </div>

          <div className="grid md:grid-cols-2 gap-8 py-8 border-y border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Limites do Plano</p>
              <p className="text-lg font-bold">{sub?.max_coupons} Cupons</p>
              <p className="text-sm text-slate-500">{sub?.max_highlighted_coupons} Destaques permitidos</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Método de Pagamento</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center">
                  <CreditCard size={20} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">Cartão de Crédito</p>
                  <p className="text-xs text-slate-500">Configurado via Stripe</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 flex gap-4">
            <Button>Alterar Plano</Button>
            <Button variant="secondary">Atualizar Pagamento</Button>
          </div>
        </Card>

        <Card className="p-6 bg-primary text-white border-none shadow-xl shadow-primary/20">
          <h3 className="text-lg font-bold mb-4">Planos Disponíveis</h3>
          <div className="space-y-4">
            {plans.map(p => (
              <div key={p.id} className="p-3 bg-white/10 rounded-lg border border-white/20">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{p.name}</span>
                  <span className="text-xs font-bold">R$ {p.price_monthly}/mês</span>
                </div>
                <p className="text-[10px] opacity-80">Até {p.max_coupons} cupons</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold">Histórico de Faturamento</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Fatura</th>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4">Valor</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {[
              { id: '#INV-001', date: '15 Mar, 2024', amount: 'R$ 89,90', status: 'Pago' },
              { id: '#INV-002', date: '15 Fev, 2024', amount: 'R$ 89,90', status: 'Pago' },
              { id: '#INV-003', date: '15 Jan, 2024', amount: 'R$ 89,90', status: 'Pago' },
            ].map(inv => (
              <tr key={inv.id} className="text-sm">
                <td className="px-6 py-4 font-bold">{inv.id}</td>
                <td className="px-6 py-4 text-slate-500">{inv.date}</td>
                <td className="px-6 py-4 font-semibold">{inv.amount}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase">{inv.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-primary font-bold hover:underline">Download PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

const StatsPage = () => {
  const [stats, setStats] = useState<any>(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    api.getStats().then(setStats);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Estatísticas Detalhadas</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Analise o desempenho de suas campanhas em tempo real.</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <input 
            type="date" 
            className="bg-transparent border-none text-xs font-bold focus:ring-0" 
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          />
          <span className="text-slate-400 text-xs">até</span>
          <input 
            type="date" 
            className="bg-transparent border-none text-xs font-bold focus:ring-0" 
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          />
          <Button variant="secondary" className="py-1 px-3 text-xs">Filtrar</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Taxa de Conversão</p>
          <p className="text-3xl font-black">3.2%</p>
          <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[3.2%]"></div>
          </div>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Melhor Horário</p>
          <p className="text-3xl font-black">18:00 - 20:00</p>
          <p className="text-xs text-emerald-500 font-bold mt-2 flex items-center gap-1">
            <TrendingUp size={14} /> +15% de engajamento
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Categoria Top</p>
          <p className="text-3xl font-black">Alimentação</p>
          <p className="text-xs text-slate-500 mt-2">65% do total de cliques</p>
        </Card>
      </div>

      <Card className="p-8">
        <h3 className="text-xl font-bold mb-6">Cliques por Dia</h3>
        <div className="h-80 flex items-end justify-between gap-4">
          {stats?.clickHistory?.length > 0 ? (
            stats.clickHistory.map((item: any, i: number) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-primary/10 rounded-t-lg relative group">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(item.count / Math.max(...stats.clickHistory.map((h: any) => h.count))) * 100}%` }}
                    className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-lg group-hover:bg-blue-600 transition-colors"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.count} cliques
                    </div>
                  </motion.div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase rotate-45 mt-4">{item.day.split('-').slice(1).join('/')}</span>
              </div>
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 italic">
              Aguardando dados de cliques...
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

const SettingsPage = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // In a real app, we'd fetch the full user profile
    const email = localStorage.getItem('cidade_cupons_user_email') || 'contato@empresa.com';
    setUser({ email, company_name: 'Minha Empresa', responsible_name: 'Responsável' });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Configurações</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Gerencie seu perfil e preferências da conta.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Store size={20} className="text-primary" /> Perfil da Empresa
            </h3>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Nome Fantasia" defaultValue={user?.company_name} />
                <Input label="CNPJ (Opcional)" placeholder="00.000.000/0000-00" />
              </div>
              <Input label="Endereço Comercial" placeholder="Rua, Número, Bairro, Cidade - UF" />
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Telefone de Contato" placeholder="(00) 00000-0000" />
                <Input label="WhatsApp para Clientes" placeholder="(00) 00000-0000" />
              </div>
              <div className="pt-4">
                <Button>Salvar Alterações</Button>
              </div>
            </form>
          </Card>

          <Card className="p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Lock size={20} className="text-primary" /> Segurança
            </h3>
            <form className="space-y-4">
              <Input label="E-mail de Acesso" defaultValue={user?.email} disabled />
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Nova Senha" type="password" />
                <Input label="Confirmar Nova Senha" type="password" />
              </div>
              <div className="pt-4">
                <Button variant="secondary">Atualizar Senha</Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold mb-4">Logo da Empresa</h3>
            <div className="flex flex-col items-center gap-4">
              <div className="size-32 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 overflow-hidden">
                <img src="https://picsum.photos/seed/logo/200/200" alt="Logo" className="w-full h-full object-cover opacity-50" />
              </div>
              <Button variant="outline" className="w-full">Alterar Logo</Button>
              <p className="text-[10px] text-slate-500 text-center uppercase tracking-wider font-bold">Recomendado: 512x512px (PNG/JPG)</p>
            </div>
          </Card>

          <Card className="p-6 border-red-100 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/10">
            <h3 className="font-bold text-red-600 mb-2">Zona de Perigo</h3>
            <p className="text-xs text-slate-500 mb-4">Ao excluir sua conta, todos os seus cupons e dados de analytics serão removidos permanentemente.</p>
            <Button variant="ghost" className="w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-900/50">Excluir Minha Conta</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('cidade_cupons_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setCurrentPage('dashboard');
      } catch (e) {
        localStorage.removeItem('cidade_cupons_user');
      }
    }
  }, []);

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    localStorage.setItem('cidade_cupons_user', JSON.stringify(userData));
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing': return <LandingPage onNavigate={setCurrentPage} />;
      case 'login': return <LoginPage onNavigate={setCurrentPage} onAuthSuccess={handleAuthSuccess} />;
      case 'register': return <RegisterPage onNavigate={setCurrentPage} onAuthSuccess={handleAuthSuccess} />;
      case 'dashboard': return (
        <DashboardLayout activePage="dashboard" onNavigate={setCurrentPage} user={user}>
          <DashboardOverview onNavigate={setCurrentPage} user={user} />
        </DashboardLayout>
      );
      case 'coupons': return (
        <DashboardLayout activePage="coupons" onNavigate={setCurrentPage} user={user}>
          <CouponsPage onNavigate={setCurrentPage} />
        </DashboardLayout>
      );
      case 'create-coupon': return (
        <DashboardLayout activePage="create-coupon" onNavigate={setCurrentPage} user={user}>
          <CreateCouponPage onNavigate={setCurrentPage} />
        </DashboardLayout>
      );
      case 'stats': return (
        <DashboardLayout activePage="stats" onNavigate={setCurrentPage} user={user}>
          <StatsPage />
        </DashboardLayout>
      );
      case 'billing': return (
        <DashboardLayout activePage="billing" onNavigate={setCurrentPage} user={user}>
          <BillingPage />
        </DashboardLayout>
      );
      case 'settings': return (
        <DashboardLayout activePage="settings" onNavigate={setCurrentPage} user={user}>
          <SettingsPage />
        </DashboardLayout>
      );
      default: return (
        <DashboardLayout activePage={currentPage} onNavigate={setCurrentPage} user={user}>
          <div className="h-full flex items-center justify-center text-slate-500">
            Página em desenvolvimento: {currentPage}
          </div>
        </DashboardLayout>
      );
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentPage}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="min-h-screen"
      >
        {renderPage()}
      </motion.div>
    </AnimatePresence>
  );
}
