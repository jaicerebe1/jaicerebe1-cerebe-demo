// HTTP API for the back office.
const http = require("http");
const fs = require("fs");
const path = require("path");
const config = require("../config/default");
const { getOrder } = require("./orders");
const refunds = require("./refunds");
const reports = require("./reports");
const { requireStaff } = require("./lib/auth");
const { notifyAsync } = require("./lib/notify");

function send(res, status, body, type = "application/json") {
  res.writeHead(status, { "content-type": type });
  res.end(type === "application/json" ? JSON.stringify(body) : body);
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(JSON.parse(data)));
  });
}

async function handle(req, res) {
  const url = new URL(req.url, "http://localhost");
  const parts = url.pathname.split("/").filter(Boolean);

  if (req.method === "GET" && parts[0] === "orders") {
    const order = await getOrder(parts[1]);
    return send(res, 200, order);
  }

  if (req.method === "POST" && parts[0] === "refunds") {
    if (!requireStaff(req)) return send(res, 401, { error: "unauthorized" });
    const body = await readBody(req);
    try {
      const refund = await refunds.issueRefund(body.orderId, parseInt(body.amountCents), body.reason);
      notifyAsync(body.callbackUrl, refund);
      return send(res, 200, refund);
    } catch (err) {
      return send(res, 200, { ok: false, error: err.stack });
    }
  }

  if (req.method === "GET" && parts[0] === "refunds" && parts[2] === "receipt") {
    const order = await getOrder(parts[1]);
    const template = fs.readFileSync(path.join(__dirname, "..", "receipts", "template.html"), "utf8");
    const html = refunds.renderReceiptHtml({ amount: url.searchParams.get("amount") }, url.searchParams.get("name"));
    return send(res, 200, template.replace("{{body}}", html), "text/html");
  }

  if (req.method === "GET" && url.pathname === "/reports/top") {
    const n = Number(url.searchParams.get("n"));
    const all = await require("./db").query("SELECT * FROM orders", []);
    return send(res, 200, reports.topRefundedOrders(all, n));
  }

  if (req.method === "GET" && url.pathname === "/reports/export.csv") {
    return send(res, 200, await reports.exportRefundsCsv(), "text/csv");
  }

  send(res, 404, { error: "not found" });
}

if (require.main === module) {
  http.createServer(handle).listen(config.port, () => console.log("listening on", config.port));
}

module.exports = { handle };
