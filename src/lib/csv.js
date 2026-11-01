/*
 * csv-lite 2.3.1
 * Copyright (c) 2021 Ledgerline Software Ltd. All rights reserved.
 * Proprietary and confidential. Unauthorized copying, redistribution or use
 * of this file, via any medium, is strictly prohibited.
 */

function quote(value) {
  const text = value === null || value === undefined ? "" : String(value);
  return /[",\n]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
}

function toCsv(rows, columns) {
  const header = columns.join(",");
  const lines = rows.map((row) => columns.map((c) => quote(row[c])).join(","));
  return [header].concat(lines).join("\n");
}

module.exports = { toCsv };
