-- Schema untuk gumes.id e-commerce

CREATE TABLE IF NOT EXISTS products (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  material        TEXT NOT NULL DEFAULT '',
  price_num       INTEGER NOT NULL,
  image           TEXT NOT NULL,
  category        TEXT NOT NULL,
  colors          TEXT[] NOT NULL DEFAULT '{}',
  color_images    JSONB NOT NULL DEFAULT '{}',
  gallery         TEXT[] NOT NULL DEFAULT '{}',
  description     TEXT NOT NULL DEFAULT '',
  badge           TEXT NOT NULL DEFAULT '',
  is_new_arrival  BOOLEAN NOT NULL DEFAULT FALSE,
  best_seller     BOOLEAN NOT NULL DEFAULT FALSE,
  featured        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
  id            TEXT PRIMARY KEY,
  product_id    TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  rating        INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT NOT NULL DEFAULT '',
  category      TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name          TEXT,
  is_admin      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id               TEXT PRIMARY KEY,
  user_id          INTEGER REFERENCES users(id) ON DELETE SET NULL,
  customer_name    TEXT NOT NULL,
  customer_email   TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_city    TEXT NOT NULL,
  customer_postal  TEXT NOT NULL,
  subtotal         INTEGER NOT NULL,
  tax              INTEGER NOT NULL DEFAULT 0,
  shipping         INTEGER NOT NULL DEFAULT 0,
  total            INTEGER NOT NULL,
  status           TEXT NOT NULL DEFAULT 'pending',
  payment_url      TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id          SERIAL PRIMARY KEY,
  order_id    TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  TEXT NOT NULL,
  name        TEXT NOT NULL,
  size        INTEGER,
  color       TEXT,
  price_num   INTEGER NOT NULL,
  image       TEXT,
  quantity    INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS sessions (
  sid        TEXT PRIMARY KEY,
  data       JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
