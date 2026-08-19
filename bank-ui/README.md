# Ledger — Bank Microservices Frontend

A React (Vite) console for your `bank-microservices` project: `auth-service`,
`account-service`, `transaction-service`, `payment-service`, and
`notification-service`, all called through `api-gateway`.

## Run it

```bash
cd banking-frontend
npm install
npm run dev
```

Opens on `http://localhost:5173`. The dev server proxies any request to
`/api/*` over to `http://localhost:8080` (see `vite.config.js`), so start
your `api-gateway` module first, on port 8080, then start the frontend.

For a production build:

```bash
npm run build
npm run preview
```

## Route assumptions — matched to your api-gateway config

These are wired up against the gateway routes you shared:

| Frontend calls               | Gateway route                    | Backend             |
|-------------------------------|-----------------------------------|----------------------|
| `POST /api/auth/login`        | `Path=/api/auth/**`              | auth-service (public) |
| `POST /api/auth/register`     | `Path=/api/auth/**`              | auth-service (public) |
| `GET  /api/auth/me`           | `Path=/api/auth/**`              | auth-service (public) |
| `GET  /api/accounts`          | `Path=/api/accounts/**`          | account-service (AuthenticationFilter) |
| `POST /api/accounts`          | `Path=/api/accounts/**`          | account-service (AuthenticationFilter) |
| `GET  /api/transactions`      | `Path=/api/transactions/**`      | transaction-service (AuthenticationFilter) |
| `GET  /api/transfers`         | `Path=/api/transfers/**`         | payment-service (AuthenticationFilter) |
| `POST /api/transfers`         | `Path=/api/transfers/**`         | payment-service (AuthenticationFilter) |
| `GET  /api/notifications`     | **missing** — no route yet       | notification-service |
| `PATCH /api/notifications/:id/read` | **missing** — no route yet | notification-service |

Two things worth doing on the backend before this all lights up:

1. **Add a gateway route for notification-service.** There's no
   `- id: notification-service` block in your config yet, so the
   Notifications page will fail to reach it (it fails gracefully — you'll
   just see a "could not reach notification-service" message — but nothing
   will load until the route exists). Something like:
   ```yaml
   - id: notification-service
     uri: http://notification-service:8085
     predicates:
       - Path=/api/notifications/**
     filters:
       - AuthenticationFilter
   ```
   (adjust the port to whatever notification-service actually listens on).

2. **Note payment-service is exposed as `/api/transfers/**`, not
   `/api/payments/**`** — the frontend calls `/api/transfers` to match your
   config, even though the page is still labeled "Payments" in the UI (that's
   just the user-facing name; feel free to rename either side).

`src/api/client.js` also assumes `POST /auth/login` returns
`{ token, user }` — a JWT and a user object — and attaches
`Authorization: Bearer <token>` to every subsequent request. Auth routes
have no `AuthenticationFilter` in your config, which lines up with login/
register being public. If `auth-service` returns a different response
shape (e.g. token only, or a `refreshToken` too), `src/context/AuthContext.jsx`
is the one place to edit.

## What's in here

- `src/api/` — one file per backend service, all going through a shared
  Axios client with a JWT interceptor and automatic redirect-to-login on 401.
- `src/context/AuthContext.jsx` — login/register/logout + persisted session
  (localStorage — fine for local dev; swap for httpOnly cookies if you
  productionize this).
- `src/pages/` — Login, Register, Dashboard, Accounts, Transactions,
  Payments, Notifications.
- `src/components/` — Navbar, ProtectedRoute (redirects unauthenticated
  users to `/login`), StatCard.

## Design notes

Went with a "bank ledger" visual language rather than a generic admin
template: deep ink-teal background, brass accent, serif display type
(Newsreader) for headings, monospace (Space Grotesk) for all currency
figures and metadata — meant to feel like a statement/ledger rather than a
SaaS dashboard. Easy to retheme via the CSS variables at the top of
`src/index.css`.

## Next steps worth doing

- Wire real error shapes once your services are returning actual error
  bodies (right now the UI just shows a generic "could not reach X-service"
  message on failure).
- Add pagination to Transactions once transaction-service supports it.
- If `api-gateway` does its own JWT validation, double check the header
  name/format it expects matches `Authorization: Bearer <token>`.
