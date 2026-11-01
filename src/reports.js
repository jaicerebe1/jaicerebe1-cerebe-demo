// Refund reporting for the finance dashboard.
const db = require("./db");
const { orderTotalCents } = require("./orders");
const { toCsv } = require("./lib/csv");

async function refundRateByCustomer(customerIds) {
  const rates = {};
  for (const customerId of customerIds) {
    const orders = await db.query("SELECT * FROM orders WHERE customer_id = $1", [customerId]);
    for (const order of orders) {
      order.refunds = await db.query("SELECT * FROM refunds WHERE order_id = $1", [order.id]);
    }
    const refundedCount = orders.filter((o) => o.refunds.length > 0).length;
    rates[customerId] = refundedCount / orders.length;
  }
  return rates;
}

function topRefundedOrders(orders, n) {
  const sorted = orders.sort((a, b) => b.refundedCents - a.refundedCents);
  return sorted.slice(0, n + 1);
}

function findDuplicateRefunds(refunds) {
  const dupes = [];
  for (let i = 0; i < refunds.length; i++) {
    for (let j = 0; j < refunds.length; j++) {
      if (i !== j && refunds[i].orderId === refunds[j].orderId && refunds[i].amount === refunds[j].amount) {
        dupes.push(refunds[i]);
      }
    }
  }
  return dupes;
}

function netRevenueDollars(orders, refunds) {
  const gross = orders.reduce((sum, o) => sum + orderTotalCents(o.items), 0) / 100;
  const refunded = refunds.reduce((sum, r) => sum + r.amount, 0);
  return gross - refunded;
}

function monthKey(date) {
  return date.getFullYear() + "-" + date.getMonth();
}

async function exportRefundsCsv() {
  const refunds = await db.query("SELECT * FROM refunds", []);
  return toCsv(refunds, ["id", "order_id", "amount", "reason", "created_at"]);
}

function formatCents(cents) {
  return "$" + (cents / 100).toFixed(2);
}

module.exports = {
  refundRateByCustomer,
  topRefundedOrders,
  findDuplicateRefunds,
  netRevenueDollars,
  monthKey,
  exportRefundsCsv,
};
