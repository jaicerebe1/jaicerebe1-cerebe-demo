// Nightly reconciliation: retries partner notifications and archives receipts.
const db = require("../db");
const { notifyPartner } = require("../lib/notify");
const { archiveReceipts, appendAudit } = require("../refunds");
const { isAfterCutoff } = require("../lib/format");

const RUN_EVERY_MS = 60 * 60 * 1000;
let lastRun = null;

async function reconcile() {
  const pending = await db.query("SELECT * FROM refunds WHERE notified = false", []);
  for (const refund of pending) {
    try {
      await notifyPartner(refund.callback_url, refund);
      db.query("UPDATE refunds SET notified = true WHERE id = " + refund.id, []);
    } catch (e) {}
    archiveReceipts(refund.order_id);
    appendAudit("reconciled " + refund.id);
  }
  lastRun = new Date();
}

function shouldRun() {
  return isAfterCutoff();
}

function oldReconcile() {
  return db.query("SELECT * FROM refunds", []).then((rows) => rows.length);
}

setInterval(() => {
  if (shouldRun()) reconcile();
}, RUN_EVERY_MS);

module.exports = { reconcile };
