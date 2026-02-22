import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase client with service role key for administrative tasks
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('CRITICAL: Supabase environment variables are missing!');
  console.error('SUPABASE_URL:', supabaseUrl ? 'Set' : 'MISSING');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Set' : 'MISSING');
}

let supabase: any;
try {
  supabase = createClient(supabaseUrl || '', supabaseServiceKey || '');
} catch (err: any) {
  console.error('FAILED to initialize Supabase client:', err.message);
  // We'll initialize a dummy client or let it be undefined to avoid crashing immediately
  // but subsequent calls will fail.
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- Auth Endpoints ---
  app.post("/api/register", async (req, res) => {
    const { email, company_name, responsible_name, phone } = req.body;
    
    try {
      console.log(`Attempting to register user: ${email}`);
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: 'password123',
        email_confirm: true,
        user_metadata: { company_name, responsible_name }
      });

      if (authError) {
        console.error('Supabase Auth Error:', authError);
        throw authError;
      }

      if (!authUser || !authUser.user) {
        throw new Error('User created but no user data returned');
      }

      console.log(`User registered successfully: ${authUser.user.id}`);
      res.json({ id: authUser.user.id, email: authUser.user.email });
    } catch (e: any) {
      console.error('Registration Error:', e);
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/login", async (req, res) => {
    const { email } = req.body;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email) // Note: Profiles table needs email if we want to query by it
        .single();

      // If profiles doesn't have email, we query auth.users (admin)
      if (error || !data) {
        const { data: users, error: userError } = await supabase.auth.admin.listUsers();
        const user = users.users.find(u => u.email === email);
        if (user) return res.json({ id: user.id, email: user.email });
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(data);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // --- Plans & Subscriptions ---
  app.get("/api/plans", async (req, res) => {
    try {
      if (!supabase) throw new Error('Supabase client not initialized. Check your environment variables.');
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('is_active', true);
      
      if (error) return res.status(400).json({ error: error.message });
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/my-subscription", async (req, res) => {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      const userId = req.headers['user-id'] as string;
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*, plans(*)')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') return res.status(400).json({ error: error.message });
      
      if (data) {
        // Flatten the response to match frontend expectations
        const sub = {
          ...data,
          plan_name: data.plans.name,
          max_coupons: data.plans.max_coupons,
          max_highlighted_coupons: data.plans.max_highlighted_coupons,
          has_stats: data.plans.has_stats
        };
        res.json(sub);
      } else {
        res.json(null);
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // --- Coupons ---
  app.get("/api/my-coupons", async (req, res) => {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      const userId = req.headers['user-id'] as string;
      const { data, error } = await supabase
        .from('coupons')
        .select('*, categories(name)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) return res.status(400).json({ error: error.message });

      const formatted = data.map(c => ({
        ...c,
        category_name: c.categories?.name
      }));
      res.json(formatted);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/create-coupon", async (req, res) => {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      const userId = req.headers['user-id'] as string;
      const { title, description, category_id, coupon_code, expiration_date, is_highlighted } = req.body;

      const { data, error } = await supabase
        .from('coupons')
        .insert([{
          user_id: userId,
          category_id,
          title,
          description,
          coupon_code,
          expiration_date,
          is_highlighted
        }])
        .select()
        .single();

      if (error) return res.status(403).json({ error: error.message });
      res.json({ id: data.id });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/update-coupon", async (req, res) => {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      const userId = req.headers['user-id'] as string;
      const { id, title, description, status, is_highlighted } = req.body;
      
      const { error } = await supabase
        .from('coupons')
        .update({ title, description, status, is_highlighted, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', userId);

      if (error) return res.status(400).json({ error: error.message });
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/delete-coupon", async (req, res) => {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      const userId = req.headers['user-id'] as string;
      const { id } = req.body;
      
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) return res.status(400).json({ error: error.message });
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // --- Clicks & Stats ---
  app.post("/api/track-click", async (req, res) => {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      const { coupon_id } = req.body;
      const userAgent = req.headers['user-agent'];
      const ip = req.ip;

      const { error } = await supabase
        .from('clicks')
        .insert([{ coupon_id, user_agent: userAgent, ip_address: ip }]);

      if (error) return res.status(400).json({ error: error.message });
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/stats", async (req, res) => {
    try {
      if (!supabase) throw new Error('Supabase client not initialized');
      const userId = req.headers['user-id'] as string;

      // Use the view we created
      const { data: viewData, error: viewError } = await supabase
        .from('user_dashboard_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (viewError) return res.status(400).json({ error: viewError.message });

      // Get click history
      const { data: clickHistory, error: historyError } = await supabase
        .rpc('get_click_history', { p_user_id: userId });

      // Fallback if RPC not defined yet
      let history = clickHistory || [];
      if (historyError) {
         const { data } = await supabase
          .from('clicks')
          .select('clicked_at, coupons!inner(user_id)')
          .eq('coupons.user_id', userId)
          .order('clicked_at', { ascending: false })
          .limit(100);
         
         const groups: Record<string, number> = {};
         data?.forEach(c => {
           const day = new Date(c.clicked_at).toISOString().split('T')[0];
           groups[day] = (groups[day] || 0) + 1;
         });
         history = Object.entries(groups).map(([day, count]) => ({ day, count })).slice(0, 7);
      }

      const { data: latestCoupons } = await supabase
        .from('coupons')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      res.json({
        totalCoupons: viewData.total_coupons || 0,
        totalClicks: viewData.total_clicks || 0,
        activeCoupons: viewData.active_coupons || 0,
        clickHistory: history,
        latestCoupons: latestCoupons || []
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
