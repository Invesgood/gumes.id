import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import bcrypt from "bcryptjs";
import { pool } from "./pool.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function seedProducts() {
  const raw = await readFile(join(__dirname, "products_seed.json"), "utf8");
  const products = JSON.parse(raw);
  for (const p of products) {
    await pool.query(
      `INSERT INTO products
        (id, name, material, price_num, image, category, colors, color_images,
         gallery, description, badge, is_new_arrival, best_seller, featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       ON CONFLICT (id) DO NOTHING`,
      [
        p.id,
        p.name,
        p.material || "",
        p.priceNum,
        p.image,
        p.category,
        p.colors || [],
        JSON.stringify(p.colorImages || {}),
        p.gallery || [],
        p.description || "",
        p.badge || "",
        !!p.isNewArrival,
        !!p.bestSeller,
        !!p.featured,
      ]
    );
  }
  console.log(`Seeded ${products.length} products.`);
}

async function seedReviews() {
  try {
    const raw = await readFile(join(__dirname, "reviews_seed.json"), "utf8");
    const reviews = JSON.parse(raw);
    if (!Array.isArray(reviews)) return;
    for (const r of reviews) {
      await pool.query(
        `INSERT INTO reviews (id, product_id, customer_name, rating, comment, category)
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (id) DO NOTHING`,
        [r.id, r.productId, r.customerName, r.rating, r.comment || "", r.category || null]
      );
    }
    console.log(`Seeded ${reviews.length} reviews.`);
  } catch {
    console.log("No reviews seed (skipped).");
  }
}

async function seedAdmin() {
  const email = "admin@gumes.id";
  const hash = await bcrypt.hash("admin123", 10);
  await pool.query(
    `INSERT INTO users (email, password_hash, name, is_admin)
     VALUES ($1,$2,$3,TRUE)
     ON CONFLICT (email) DO NOTHING`,
    [email, hash, "Admin"]
  );
  console.log("Seeded admin (email=admin@gumes.id, password=admin123).");
}

await seedProducts();
await seedReviews();
await seedAdmin();
await pool.end();
