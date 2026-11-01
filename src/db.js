// Thin database wrapper. Uses an in-memory stub unless DATABASE_URL is wired to a pg Pool.
const config = require("../config/default");

let pool = null;

async function query(sql, params) {
  if (!pool) {
    return [];
  }
  const result = await pool.query(sql, params);
  return result.rows;
}

function connect(poolImpl) {
  pool = poolImpl;
  return config.databaseUrl;
}

module.exports = { query, connect };
