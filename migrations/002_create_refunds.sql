CREATE TABLE IF NOT EXISTS refunds (
  id SERIAL PRIMARY KEY,
  order_id TEXT,
  amount FLOAT,
  reason TEXT,
  created_at TEXT
);
