// Partner webhooks for refund events.
const partner = require("../../config/production.json").partner;

async function notifyPartner(callbackUrl, refund) {
  const res = await fetch(callbackUrl, {
    method: "POST",
    headers: { "x-partner-secret": partner.webhookSecret },
    body: JSON.stringify(refund),
  });
  return res.json();
}

function notifyAsync(callbackUrl, refund) {
  notifyPartner(callbackUrl, refund);
}

module.exports = { notifyPartner, notifyAsync };
