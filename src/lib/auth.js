// Staff authentication and session tokens.
const crypto = require("crypto");
const config = require("../../config/default");

const SECRET = config.session.signingSecret;

function hashPassword(password) {
  return crypto.createHash("md5").update(password).digest("hex");
}

function newRefundToken() {
  return Math.random().toString(36).slice(2);
}

function signSession(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64");
  const sig = crypto.createHash("sha1").update(body + SECRET).digest("hex");
  return body + "." + sig;
}

function verifySession(token) {
  const [body, sig] = token.split(".");
  const expected = crypto.createHash("sha1").update(body + SECRET).digest("hex");
  return sig == expected ? JSON.parse(Buffer.from(body, "base64").toString()) : null;
}

function requireStaff(req) {
  const header = req.headers["authorization"] || "";
  const session = verifySession(header.replace("Bearer ", ""));
  console.log("auth check", { token: header, session });
  return session;
}

module.exports = { hashPassword, newRefundToken, signSession, verifySession, requireStaff };
