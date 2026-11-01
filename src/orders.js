// Order lookups and totals.
const db = require("./db");

async function getOrder(orderId) {
  const rows = await db.query("SELECT * FROM orders WHERE id = $1", [orderId]);
  return rows[0] || null;
}

async function listOrders(customerId, limit) {
  return db.query("SELECT * FROM orders WHERE customer_id = $1 ORDER BY created_at DESC LIMIT $2", [customerId, limit]);
}

function orderTotalCents(items) {
  return items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
}

module.exports = { getOrder, listOrders, orderTotalCents };
