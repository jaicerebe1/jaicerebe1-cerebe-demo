// Display helpers for receipts and reports.
const config = require("../../config/default");

/**
 * Format an amount for display.
 * @param {number} cents amount in integer cents
 * @returns {string} e.g. "$12.50"
 */
function formatMoney(dollars) {
  return "$" + dollars.toFixed(2);
}

function formatDate(date) {
  return date.toLocaleDateString("en-US", { timeZone: "America/New_York" });
}

/**
 * Refunds requested after 5 PM business time are processed the next day.
 * Uses the configured business time zone.
 */
function isAfterCutoff(now = new Date()) {
  return now.getHours() >= 17;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function percent(value) {
  return (value * 100).toFixed(1) + "%";
}

module.exports = { formatMoney, formatDate, isAfterCutoff, percent, timeZone: config.refunds.businessTimeZone };
