import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("database.db");

// Initialize database with the requested SaaS architecture
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    company_name TEXT,
    responsible_name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    role TEXT DEFAULT 'company',
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS plans (
    id TEXT PRIMARY KEY,
    name TEXT,
    price_monthly REAL,
    price_yearly REAL,
    max_coupons INTEGER,
    max_highlighted_coupons INTEGER,
    has_stats BOOLEAN,
    priority_support BOOLEAN,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    plan_id TEXT,
    status TEXT DEFAULT 'active',
    billing_cycle TEXT,
    start_date DATETIME,
    end_date DATETIME,
    payment_provider TEXT,
    payment_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(plan_id) REFERENCES plans(id)
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT,
    slug TEXT UNIQUE,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS coupons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    category_id TEXT,
    title TEXT,
    description TEXT,
    coupon_code TEXT,
    image_url TEXT,
    expiration_date DATETIME,
    is_highlighted BOOLEAN DEFAULT 0,
    status TEXT DEFAULT 'active',
    clicks_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS clicks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    coupon_id INTEGER,
    user_agent TEXT,
    ip_address TEXT,
    clicked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(coupon_id) REFERENCES coupons(id)
  );
`);

// Seed initial data if empty
const seedData = () => {
  const planCount = db.prepare("SELECT COUNT(*) as count FROM plans").get() as any;
  if (planCount.count === 0) {
    const insertPlan = db.prepare(`
      INSERT INTO plans (id, name, price_monthly, price_yearly, max_coupons, max_highlighted_coupons, has_stats, priority_support)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertPlan.run('free', 'Grátis', 0, 0, 5, 0, 0, 0);
    insertPlan.run('pro', 'Pro', 97, 970, 100, 10, 1, 1);
    insertPlan.run('premium', 'Premium', 297, 2970, 9999, 9999, 1, 1);
  }

  const catCount = db.prepare("SELECT COUNT(*) as count FROM categories").get() as any;
  if (catCount.count === 0) {
    const insertCat = db.prepare("INSERT INTO categories (id, name, slug) VALUES (?, ?, ?)");
    insertCat.run('food', 'Alimentação & Bebidas', 'food');
    insertCat.run('retail', 'Varejo & Moda', 'retail');
    insertCat.run('services', 'Serviços', 'services');
    insertCat.run('beauty', 'Beleza & Estética', 'beauty');
  }
};
seedData();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- Auth Endpoints ---
  app.post("/api/register", (req, res) => {
    const { email, company_name, responsible_name, phone } = req.body;
    const id = Math.random().toString(36).substring(7);
    try {
      db.prepare(`
        INSERT INTO users (id, email, company_name, responsible_name, phone)
        VALUES (?, ?, ?, ?, ?)
      `).run(id, email, company_name, responsible_name, phone);
      
      // Auto-subscribe to free plan
      db.prepare(`
        INSERT INTO subscriptions (id, user_id, plan_id, billing_cycle, start_date, end_date)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(Math.random().toString(36).substring(7), id, 'free', 'monthly', new Date().toISOString(), '2099-12-31');

      res.json({ id, email });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/login", (req, res) => {
    const { email } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (user) res.json(user);
    else res.status(404).json({ error: "User not found" });
  });

  // --- Plans & Subscriptions ---
  app.get("/api/plans", (req, res) => {
    res.json(db.prepare("SELECT * FROM plans WHERE is_active = 1").all());
  });

  app.get("/api/my-subscription", (req, res) => {
    const userId = req.headers['user-id'];
    const sub = db.prepare(`
      SELECT s.*, p.name as plan_name, p.max_coupons, p.max_highlighted_coupons, p.has_stats
      FROM subscriptions s
      JOIN plans p ON s.plan_id = p.id
      WHERE s.user_id = ? AND s.status = 'active'
    `).get(userId);
    res.json(sub || null);
  });

  // --- Coupons ---
  app.get("/api/my-coupons", (req, res) => {
    const userId = req.headers['user-id'];
    const coupons = db.prepare(`
      SELECT c.*, cat.name as category_name
      FROM coupons c
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
    `).all(userId);
    res.json(coupons);
  });

  app.post("/api/create-coupon", (req, res) => {
    const userId = req.headers['user-id'] as string;
    const { title, description, category_id, coupon_code, expiration_date, is_highlighted } = req.body;

    // Check limits
    const sub = db.prepare(`
      SELECT p.max_coupons, p.max_highlighted_coupons,
             (SELECT COUNT(*) FROM coupons WHERE user_id = ?) as current_coupons,
             (SELECT COUNT(*) FROM coupons WHERE user_id = ? AND is_highlighted = 1) as current_highlighted
      FROM subscriptions s
      JOIN plans p ON s.plan_id = p.id
      WHERE s.user_id = ? AND s.status = 'active'
    `).get(userId, userId, userId) as any;

    if (!sub) return res.status(403).json({ error: "No active subscription" });
    if (sub.current_coupons >= sub.max_coupons) return res.status(403).json({ error: "Coupon limit reached" });
    if (is_highlighted && sub.current_highlighted >= sub.max_highlighted_coupons) {
      return res.status(403).json({ error: "Highlighted coupon limit reached" });
    }

    const info = db.prepare(`
      INSERT INTO coupons (user_id, category_id, title, description, coupon_code, expiration_date, is_highlighted)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(userId, category_id, title, description, coupon_code, expiration_date, is_highlighted ? 1 : 0);

    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/update-coupon", (req, res) => {
    const userId = req.headers['user-id'];
    const { id, title, description, status, is_highlighted } = req.body;
    db.prepare(`
      UPDATE coupons 
      SET title = ?, description = ?, status = ?, is_highlighted = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `).run(title, description, status, is_highlighted ? 1 : 0, id, userId);
    res.json({ success: true });
  });

  app.delete("/api/delete-coupon", (req, res) => {
    const userId = req.headers['user-id'];
    const { id } = req.body;
    db.prepare("DELETE FROM coupons WHERE id = ? AND user_id = ?").run(id, userId);
    res.json({ success: true });
  });

  // --- Clicks & Stats ---
  app.post("/api/track-click", (req, res) => {
    const { coupon_id } = req.body;
    const userAgent = req.headers['user-agent'];
    const ip = req.ip;

    db.transaction(() => {
      db.prepare("INSERT INTO clicks (coupon_id, user_agent, ip_address) VALUES (?, ?, ?)").run(coupon_id, userAgent, ip);
      db.prepare("UPDATE coupons SET clicks_count = clicks_count + 1 WHERE id = ?").run(coupon_id);
    })();

    res.json({ success: true });
  });

  app.get("/api/stats", (req, res) => {
    const userId = req.headers['user-id'];
    const { start_date, end_date } = req.query;

    const totalCoupons = db.prepare("SELECT COUNT(*) as count FROM coupons WHERE user_id = ?").get(userId) as any;
    const totalClicks = db.prepare("SELECT SUM(clicks_count) as count FROM coupons WHERE user_id = ?").get(userId) as any;
    const activeCoupons = db.prepare("SELECT COUNT(*) as count FROM coupons WHERE user_id = ? AND status = 'active'").get(userId) as any;
    
    // Simple click history for chart
    const clickHistory = db.prepare(`
      SELECT date(clicked_at) as day, COUNT(*) as count
      FROM clicks cl
      JOIN coupons co ON cl.coupon_id = co.id
      WHERE co.user_id = ?
      GROUP BY day
      ORDER BY day DESC
      LIMIT 7
    `).all(userId);

    res.json({
      totalCoupons: totalCoupons.count || 0,
      totalClicks: totalClicks.count || 0,
      activeCoupons: activeCoupons.count || 0,
      clickHistory
    });
  });

  // --- Cron Simulation ---
  setInterval(() => {
    const now = new Date().toISOString();
    // Expire subscriptions
    db.prepare("UPDATE subscriptions SET status = 'expired' WHERE end_date < ? AND status = 'active'").run(now);
    // Expire coupons
    db.prepare("UPDATE coupons SET status = 'expired' WHERE expiration_date < ? AND status = 'active'").run(now);
  }, 1000 * 60 * 60); // Every hour

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
