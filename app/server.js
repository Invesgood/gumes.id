import express from "express";
import session from "express-session";
import bcrypt from "bcryptjs";
import Busboy from "busboy";
import sharp from "sharp";
import { writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { randomBytes } from "crypto";
import "dotenv/config";
import { pool, query } from "./db/pool.js";
import { createPayment, verifyNotificationSignature } from "./lib/doku.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

// Skip JSON parsing for webhook route — we need the raw body for signature verification
app.use((req, res, next) => {
  if (req.path === "/api/doku/notify") return next();
  express.json({ limit: "10mb" })(req, res, next);
});
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static(join(__dirname, "public"), {
  maxAge: process.env.NODE_ENV === "production" ? "30d" : 0,
  etag: true,
}));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax", maxAge: 1000 * 60 * 60 * 24 * 30 },
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.theme = "light";
  res.locals.path = req.path;
  next();
});

// ─── Pages ──────────────────────────────────────────────────────────────

app.get("/", async (req, res) => {
  const products = await fetchProducts();
  res.render("home", {
    title: "GUMES.ID | Leather Atelier & Curators",
    products,
  });
});

app.get("/new-arrival", async (req, res) => {
  const all = await fetchProducts();
  const products = all.filter((p) => p.isNewArrival);
  res.render("new-arrival", {
    title: "New Arrivals — GUMES.ID",
    products,
  });
});

app.get("/location", (req, res) => {
  res.render("location", { title: "Our Atelier — GUMES.ID" });
});

app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact — GUMES.ID" });
});

app.get("/product/:id", async (req, res) => {
  const product = await fetchProductById(req.params.id);
  if (!product) {
    return res.status(404).render("404", { title: "Produk tidak ditemukan" });
  }
  const reviews = await fetchReviews(req.params.id);
  res.render("product", {
    title: `${product.name} — GUMES.ID`,
    product,
    reviews,
  });
});

app.get("/cart", (req, res) => {
  res.render("cart", { title: "Shopping Cart — GUMES.ID" });
});

app.get("/checkout", (req, res) => {
  res.render("checkout", { title: "Checkout — GUMES.ID" });
});

app.get("/login", (req, res) => {
  if (req.session.user) return res.redirect("/profile");
  res.render("login", { title: "Sign In — GUMES.ID", redirect: req.query.redirect || "/" });
});

app.get("/signup", (req, res) => {
  if (req.session.user) return res.redirect("/profile");
  res.render("signup", { title: "Create Account — GUMES.ID" });
});

app.get("/profile", requireAuth, (req, res) => {
  res.render("profile", { title: "Your Profile — GUMES.ID" });
});

app.get("/orders", requireAuth, async (req, res) => {
  const { rows } = await query(
    `SELECT o.id, o.total, o.status, o.created_at,
            COALESCE(string_agg(oi.name, ', '), '') AS item_names,
            COALESCE(json_agg(json_build_object('product_id', oi.product_id, 'name', oi.name)) FILTER (WHERE oi.id IS NOT NULL), '[]') AS items
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC`,
    [req.session.user.id]
  );
  const orders = rows.map((r) => ({
    id: r.id,
    total: r.total,
    status: r.status,
    date: r.created_at.toISOString().slice(0, 10),
    items: r.items,
    itemNames: r.item_names,
  }));
  res.render("orders", { title: "Order History — GUMES.ID", orders });
});

app.get("/checkout/success", async (req, res) => {
  const orderId = req.query.order;
  let order = null;
  if (orderId) order = await fetchOrder(String(orderId));
  res.render("checkout-success", { title: "Order Confirmed — GUMES.ID", order });
});

// ─── API ─────────────────────────────────────────────────────────────────

app.get("/api/products", async (req, res) => {
  const products = await fetchProducts();
  res.json(products);
});

app.get("/api/products/:id", async (req, res) => {
  const p = await fetchProductById(req.params.id);
  if (!p) return res.status(404).json({ error: "not_found" });
  res.json(p);
});

app.get("/api/reviews", async (req, res) => {
  const productId = req.query.productId;
  if (!productId) return res.json([]);
  const reviews = await fetchReviews(String(productId));
  res.json(reviews);
});

app.post("/api/checkout", async (req, res) => {
  try {
    const { customer, items, subtotal, tax, shipping = 0, total } = req.body || {};
    if (!customer || !items?.length) {
      return res.status(400).json({ error: "Cart dan customer harus diisi" });
    }
    const { name, email, phone, address, district, city, province, postal } = customer;
    if (!name || !email || !address || !city || !postal) {
      return res.status(400).json({ error: "Lengkapi semua field pengiriman" });
    }
    const orderId = "GMS-" + new Date().toISOString().slice(0,10).replace(/-/g,"") + "-" + randomBytes(3).toString("hex").toUpperCase();
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        `INSERT INTO orders (id, user_id, customer_name, customer_email, customer_phone,
                             customer_address, customer_district, customer_city, customer_province,
                             customer_postal, subtotal, tax, shipping, total, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,'pending')`,
        [orderId, req.session.user?.id || null, name, email, phone || null,
          address, district || null, city, province || null, postal,
          subtotal | 0, tax | 0, shipping | 0, total | 0]
      );
      for (const it of items) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, name, size, color, price_num, image, quantity)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [orderId, it.productId, it.name, it.size || null, it.color || null,
            it.priceNum | 0, it.image || null, it.quantity || 1]
        );
      }
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }

    // Try to create Doku payment. Falls back gracefully if DOKU env missing/sandbox-only.
    const dokuConfigured = process.env.DOKU_CLIENT_ID && !process.env.DOKU_CLIENT_ID.includes("XXXX");
    if (dokuConfigured) {
      try {
        const { paymentUrl } = await createPayment({
          orderId, customer, items, total,
        });
        await query(`UPDATE orders SET payment_url = $1 WHERE id = $2`, [paymentUrl, orderId]);
        return res.json({ order_id: orderId, payment_url: paymentUrl, redirect_url: paymentUrl });
      } catch (e) {
        console.error("Doku create payment failed:", e.message);
        await query(`UPDATE orders SET status = 'failed_payment' WHERE id = $1`, [orderId]);
        return res.status(502).json({ error: "Gagal hubungi gateway pembayaran. Coba lagi atau hubungi admin.", detail: e.message });
      }
    }

    // No Doku configured → mock success (dev mode)
    res.json({ order_id: orderId, redirect_url: `/checkout/success?order=${orderId}`, mock: true });
  } catch (e) {
    console.error("checkout error", e);
    res.status(500).json({ error: "Server error" });
  }
});

// Doku payment notification webhook
// Uses raw body to verify HMAC signature.
app.post("/api/doku/notify",
  express.raw({ type: "application/json", limit: "1mb" }),
  async (req, res) => {
    try {
      const rawBody = req.body.toString("utf8");
      const signature = req.headers["signature"];
      const requestId = req.headers["request-id"];
      const requestTimestamp = req.headers["request-timestamp"];

      const ok = verifyNotificationSignature({
        clientId: process.env.DOKU_CLIENT_ID,
        secretKey: process.env.DOKU_SECRET_KEY,
        requestId, requestTimestamp,
        requestTarget: "/api/doku/notify",
        rawBody,
        signature,
      });
      if (!ok) {
        console.warn("Doku notify: invalid signature");
        return res.status(401).json({ error: "Invalid signature" });
      }

      const data = JSON.parse(rawBody);
      const orderId = data?.order?.invoice_number;
      const status = String(data?.transaction?.status || "").toUpperCase();
      if (!orderId) return res.status(400).json({ error: "Missing invoice_number" });

      let dbStatus = "pending";
      if (status === "SUCCESS") dbStatus = "paid";
      else if (status === "FAILED" || status === "EXPIRED") dbStatus = "failed_payment";

      await query(`UPDATE orders SET status = $1 WHERE id = $2`, [dbStatus, orderId]);
      console.log(`Doku notify: ${orderId} → ${dbStatus}`);
      res.json({ ok: true });
    } catch (e) {
      console.error("Doku notify error", e);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Auth API
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "Email & password wajib" });
    if (password.length < 6) return res.status(400).json({ error: "Password minimal 6 karakter" });
    const existing = await query(`SELECT id FROM users WHERE email = $1`, [email]);
    if (existing.rows.length) return res.status(400).json({ error: "Email sudah terdaftar" });
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await query(
      `INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, is_admin`,
      [email, hash, name || null]
    );
    req.session.user = { id: rows[0].id, email: rows[0].email, name: rows[0].name, is_admin: rows[0].is_admin };
    res.json({ ok: true, user: req.session.user });
  } catch (e) {
    console.error("signup error", e);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "Email & password wajib" });
    const { rows } = await query(`SELECT id, email, name, password_hash, is_admin FROM users WHERE email = $1`, [email]);
    const u = rows[0];
    if (!u) return res.status(401).json({ error: "Email/password salah" });
    const ok = await bcrypt.compare(password, u.password_hash);
    if (!ok) return res.status(401).json({ error: "Email/password salah" });
    req.session.user = { id: u.id, email: u.email, name: u.name, is_admin: u.is_admin };
    res.json({ ok: true, user: req.session.user });
  } catch (e) {
    console.error("login error", e);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, inquiry, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Nama, email & pesan wajib diisi" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Format email tidak valid" });
    }
    if (message.length > 5000) {
      return res.status(400).json({ error: "Pesan terlalu panjang (maks 5000 karakter)" });
    }
    await query(
      `INSERT INTO contact_messages (name, email, inquiry, message) VALUES ($1,$2,$3,$4)`,
      [name.slice(0, 200), email.slice(0, 200), (inquiry || "").slice(0, 200), message]
    );
    res.json({ ok: true });
  } catch (e) {
    console.error("contact error", e);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/reviews", async (req, res) => {
  try {
    const { productId, customerName, rating, comment, category } = req.body || {};
    if (!productId || !rating) return res.status(400).json({ error: "productId & rating wajib" });
    const id = "REV-" + Date.now().toString(36) + "-" + randomBytes(2).toString("hex");
    await query(
      `INSERT INTO reviews (id, product_id, customer_name, rating, comment, category)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [id, productId, customerName || req.session.user?.name || "Anon", rating | 0, comment || "", category || null]
    );
    res.json({ ok: true, id });
  } catch (e) {
    console.error("review error", e);
    res.status(500).json({ error: "Server error" });
  }
});

// ─── Admin ──────────────────────────────────────────────────────────────

app.get("/admin", requireAdmin, async (req, res) => {
  const products = await fetchProducts();
  const reviews = await fetchAllReviews();
  res.render("admin", { title: "Admin — GUMES.ID", products, reviews });
});

app.post("/api/products", requireAdminAPI, async (req, res) => {
  try {
    const p = req.body || {};
    if (!p.name || !p.priceNum || !p.category) {
      return res.status(400).json({ error: "name, priceNum, category wajib" });
    }
    const id = String(Date.now());
    await query(
      `INSERT INTO products (id, name, material, price_num, image, category, colors, color_images,
                             gallery, description, badge, is_new_arrival, best_seller, featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
      [id, p.name, p.material || "", p.priceNum | 0, p.image || "", p.category,
        p.colors || [], JSON.stringify(p.colorImages || {}),
        p.gallery || [], p.description || "", p.badge || "",
        !!p.isNewArrival, !!p.bestSeller, !!p.featured]
    );
    res.json({ ok: true, id });
  } catch (e) {
    console.error("create product error", e);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/products/:id", requireAdminAPI, async (req, res) => {
  try {
    const p = req.body || {};
    const result = await query(
      `UPDATE products SET
         name = $1, material = $2, price_num = $3, image = $4, category = $5,
         colors = $6, color_images = $7, gallery = $8, description = $9, badge = $10,
         is_new_arrival = $11, best_seller = $12, featured = $13
       WHERE id = $14`,
      [p.name, p.material || "", p.priceNum | 0, p.image || "", p.category,
        p.colors || [], JSON.stringify(p.colorImages || {}),
        p.gallery || [], p.description || "", p.badge || "",
        !!p.isNewArrival, !!p.bestSeller, !!p.featured, req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (e) {
    console.error("update product error", e);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/products/:id", requireAdminAPI, async (req, res) => {
  try {
    const r = await query(`DELETE FROM products WHERE id = $1`, [req.params.id]);
    if (r.rowCount === 0) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (e) {
    console.error("delete product error", e);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/reviews/:id", requireAdminAPI, async (req, res) => {
  try {
    const r = await query(`DELETE FROM reviews WHERE id = $1`, [req.params.id]);
    if (r.rowCount === 0) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (e) {
    console.error("delete review error", e);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/upload", requireAdminAPI, async (req, res) => {
  try {
    const buffer = await parseUpload(req);
    if (!buffer) return res.status(400).json({ error: "No file" });
    const optimized = await sharp(buffer)
      .rotate()
      .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80, effort: 4 })
      .toBuffer();
    const filename = `${Date.now()}-${randomBytes(3).toString("hex")}.webp`;
    await writeFile(join(__dirname, "public", "images", filename), optimized);
    res.json({ url: `/images/${filename}` });
  } catch (e) {
    console.error("upload error", e);
    res.status(500).json({ error: "Upload failed" });
  }
});

function parseUpload(req) {
  return new Promise((resolve, reject) => {
    const bb = Busboy({ headers: req.headers, limits: { fileSize: 15 * 1024 * 1024 } });
    let fileBuf = null;
    bb.on("file", (_name, stream) => {
      const chunks = [];
      stream.on("data", (d) => chunks.push(d));
      stream.on("end", () => { fileBuf = Buffer.concat(chunks); });
      stream.on("limit", () => reject(new Error("File too large")));
    });
    bb.on("finish", () => resolve(fileBuf));
    bb.on("error", reject);
    req.pipe(bb);
  });
}

app.get("/healthz", (req, res) => res.json({ ok: true }));

// 404
app.use((req, res) => {
  if (req.path.startsWith("/api/")) return res.status(404).json({ error: "not_found" });
  res.status(404).render("404", { title: "Page Not Found" });
});

// ─── middleware ────────────────────────────────────────────────────────

function requireAuth(req, res, next) {
  if (!req.session.user) return res.redirect(`/login?redirect=${encodeURIComponent(req.originalUrl)}`);
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.user) return res.redirect(`/login?redirect=${encodeURIComponent(req.originalUrl)}`);
  if (!req.session.user.is_admin) return res.status(403).render("404", { title: "Forbidden" });
  next();
}

function requireAdminAPI(req, res, next) {
  if (!req.session.user) return res.status(401).json({ error: "Login required" });
  if (!req.session.user.is_admin) return res.status(403).json({ error: "Admin only" });
  next();
}

// ─── DB helpers ─────────────────────────────────────────────────────────

async function fetchProducts() {
  const { rows } = await query(
    `SELECT id, name, material, price_num, image, category, colors, color_images,
            gallery, description, badge, is_new_arrival, best_seller, featured
       FROM products ORDER BY created_at DESC`
  );
  return rows.map(rowToProduct);
}

async function fetchProductById(id) {
  const { rows } = await query(
    `SELECT id, name, material, price_num, image, category, colors, color_images,
            gallery, description, badge, is_new_arrival, best_seller, featured
       FROM products WHERE id = $1`,
    [id]
  );
  return rows[0] ? rowToProduct(rows[0]) : null;
}

async function fetchReviews(productId) {
  const { rows } = await query(
    `SELECT id, product_id, customer_name, rating, comment, category, created_at
       FROM reviews WHERE product_id = $1 ORDER BY created_at DESC`,
    [productId]
  );
  return rows.map(reviewRow);
}

async function fetchAllReviews() {
  const { rows } = await query(
    `SELECT r.id, r.product_id, r.customer_name, r.rating, r.comment, r.category, r.created_at,
            p.name AS product_name
       FROM reviews r LEFT JOIN products p ON p.id = r.product_id
       ORDER BY r.created_at DESC`
  );
  return rows.map((r) => ({ ...reviewRow(r), productName: r.product_name || "—" }));
}

function reviewRow(r) {
  return {
    id: r.id,
    productId: r.product_id,
    customerName: r.customer_name,
    rating: r.rating,
    comment: r.comment,
    category: r.category,
    date: r.created_at.toISOString().slice(0, 10),
  };
}

async function fetchOrder(id) {
  const { rows } = await query(`SELECT * FROM orders WHERE id = $1`, [id]);
  if (!rows[0]) return null;
  const items = await query(`SELECT * FROM order_items WHERE order_id = $1`, [id]);
  return { ...rows[0], items: items.rows };
}

function rowToProduct(r) {
  return {
    id: r.id,
    name: r.name,
    material: r.material,
    priceNum: r.price_num,
    price: formatIDR(r.price_num),
    image: r.image,
    category: r.category,
    colors: r.colors || [],
    colorImages: r.color_images || {},
    gallery: r.gallery || [],
    description: r.description || "",
    badge: r.badge || "",
    isNewArrival: r.is_new_arrival,
    bestSeller: r.best_seller,
    featured: r.featured,
  };
}

function formatIDR(n) {
  return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

// ─── start ─────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`gumes.id running → http://localhost:${PORT}`);
});

process.on("SIGTERM", async () => {
  await pool.end();
  process.exit(0);
});
