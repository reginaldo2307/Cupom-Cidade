import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("database.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    company_name TEXT,
    responsible_name TEXT,
    plan TEXT DEFAULT 'free'
  );

  CREATE TABLE IF NOT EXISTS coupons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    category TEXT,
    description TEXT,
    code TEXT,
    expiry_date TEXT,
    status TEXT DEFAULT 'active',
    clicks INTEGER DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    coupon_id INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    type TEXT,
    FOREIGN KEY(coupon_id) REFERENCES coupons(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Auth Middleware (for demo purposes)
  const mockUserId = 1; 

  // API Routes
  app.get("/api/stats", (req, res) => {
    const totalCoupons = db.prepare("SELECT COUNT(*) as count FROM coupons WHERE user_id = ?").get(mockUserId);
    const totalClicks = db.prepare("SELECT SUM(clicks) as count FROM coupons WHERE user_id = ?").get(mockUserId);
    const activeCoupons = db.prepare("SELECT COUNT(*) as count FROM coupons WHERE user_id = ? AND status = 'active'").get(mockUserId);
    
    res.json({
      totalCoupons: totalCoupons.count || 0,
      totalClicks: totalClicks.count || 0,
      activeCoupons: activeCoupons.count || 0,
      plan: "Pro Business"
    });
  });

  app.get("/api/coupons", (req, res) => {
    const coupons = db.prepare("SELECT * FROM coupons WHERE user_id = ? ORDER BY id DESC").all(mockUserId);
    res.json(coupons);
  });

  app.post("/api/coupons", (req, res) => {
    const { title, category, description, code, expiry_date } = req.body;
    const info = db.prepare(`
      INSERT INTO coupons (user_id, title, category, description, code, expiry_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(mockUserId, title, category, description, code, expiry_date);
    res.json({ id: info.lastInsertRowid });
  });

  app.delete("/api/coupons/:id", (req, res) => {
    db.prepare("DELETE FROM coupons WHERE id = ? AND user_id = ?").run(req.params.id, mockUserId);
    res.json({ success: true });
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
