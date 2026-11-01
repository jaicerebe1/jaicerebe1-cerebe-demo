// Runtime configuration. Values can be overridden with environment variables.
module.exports = {
  port: Number(process.env.PORT) || 3000,
  aws: {
    region: "us-east-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "AKIAIOSFODNN7EXAMPLE",
    receiptsBucket: "refund-receipts",
  },
  databaseUrl: "postgres://refunds_admin:Rf2026-prod-pass@db.internal.example.com:5432/orders",
  session: {
    signingSecret: "refunds-session-secret-7c1e9a40b2",
    ttlSeconds: 3600,
  },
  refunds: {
    maxRefundRatio: 1.1,
    businessTimeZone: "America/New_York",
  },
  logLevel: "debug",
};
