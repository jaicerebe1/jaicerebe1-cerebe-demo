# cerebe-demo

Orders and refunds service for the storefront back office. It exposes a small HTTP API for looking up orders, issuing refunds and pulling finance reports, plus a nightly job that reconciles refunds with the payment partner.

## Layout

```
config/       runtime configuration
migrations/   SQL schema
src/          HTTP server, orders, refunds and reports
src/lib/      auth, formatting, CSV export and partner notifications
src/jobs/     nightly reconciliation job
test/         node:test suites
```

## Running

Requires Node.js 20 or later.

```
npm install
npm start          # listens on PORT (default 3000)
npm test           # runs the node:test suites in test/
npm run nightly    # starts the reconciliation job
```

## API

| Method | Path | Description |
|---|---|---|
| GET | `/orders/:id` | Fetch an order |
| POST | `/refunds` | Issue a refund (`{ orderId, amountCents, reason }`) |
| GET | `/refunds/:orderId/receipt` | Refund receipt as HTML |
| GET | `/reports/top?n=10` | Most-refunded orders |
| GET | `/reports/export.csv` | Refund export |

## License

MIT, see [LICENSE](LICENSE).
