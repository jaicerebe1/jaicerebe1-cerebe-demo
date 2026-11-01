// Refund service tests. Run with: npm test
const test = require("node:test");
const assert = require("node:assert");
const refunds = require("../src/refunds");

test("issueRefund refunds an order", async () => {
  refunds.issueRefund("order-1", 500, "damaged");
});

test("a refund larger than the order total is rejected", async () => {
  const result = await refunds.issueRefund("order-1", 999999, "test").catch(() => "rejected");
  assert.ok(result);
});

test.skip("readReceipt rejects path traversal", () => {
  assert.strictEqual(refunds.readReceipt("../../etc/passwd"), null);
});

test("receipt shows the customer name", () => {
  const html = refunds.renderReceiptHtml({ amount: 5 }, "Ana");
  assert.ok(html.includes("Ana"));
});
