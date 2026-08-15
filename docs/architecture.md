# Architecture

## Overview

This repository is the **frontend only**. It is a Vite-built React 19 single-page application deployed to Netlify, which talks to a separately hosted backend (Node/Express-style REST API, deployed on Render) over HTTPS via Axios, and over WebSockets via `socket.io-client`. The backend's source is not part of this repository.

## Route domains

`App.jsx` defines all routing directly (there is no separate router config file in active use — `src/routes/AppRoutes.jsx` exists but is empty and unused). Three domains share one `<Router>`:

1. **Public** — `/`, `/about`, `/contact`, `/services`, `/services/:slug` (9 individual service pages), `/products/books`, `/products/code-templates`, `/portfolio`, `/projects`, `/blog`, `/book-free-call`, `/privacy-policy`, `/terms-of-service`
2. **User** (`/user/*`) — `register`, `login`, `forgot-password`, `reset-password`, `messages`, `downloads`, `orders`, `profile`, `settings`
3. **Admin** (`/admin/*`) — `register`, `login`, `forgot-password`, `reset-password`, `dashboard`, `messages`, `main-settings`, `manage-blog`, `manage-blog-categories`, `manage-coupons`, `manage-contact-us-messages`, `manage-book-free-calls-messages`, `manage-news-letter-subscribers`, `manage-products`, `manage-product-categories`, `manage-project-categories`, `manage-projects`

A catch-all `<Route path="*" element={<Error404 />} />` handles unmatched routes.

## Layout switching

Two wrapper components in `App.jsx` decide which chrome renders:

- **`NavbarWrapper`** — renders `AdminNavbar` when the path starts with `/admin` *and* `AdminContext` reports an authenticated admin; otherwise renders the standard public/user `Navbar`. It also toggles the `FloatingActionButton`, which is hidden on admin routes.
- **`AdminLayoutWrapper`** — wraps children in the admin sidebar layout (`AdminSidebar` + content area) only when on an admin route with an authenticated admin session.
- **`Footer`** is rendered everywhere except paths starting with `/admin`.

## Authentication

Two independent React Context providers, each with its own fetch/login/logout logic:

| | `AuthContext` (user) | `AdminContext` (admin) |
|---|---|---|
| Profile fetch | `GET /api/users/profile` (cookie-based, `withCredentials: true`) | `GET /api/admin/profile` (Bearer token from `localStorage.adminToken`) |
| Login | `POST /api/users/login` | Handled in `pages/admin/auth/Login.jsx` |
| Guarding | Used ad hoc in user pages | `RequireAdmin.jsx` wraps admin routes/components and checks `AdminContext` state |

Note the asymmetry: the user flow relies on httpOnly cookies for the session; the admin flow additionally stores a token in `localStorage` and sends it as an `Authorization` header. This is documented as observed behavior, not a recommendation — see `docs/development.md` for related notes.

`src/components/common/AdminRoute.jsx` and `ProtectedRoute.jsx` exist as empty files and are not currently used for route guarding; `RequireAdmin.jsx` (in `components/layout/`) is the component actually doing that job.

## Data flow

```
Page component (e.g. ManageProducts.jsx)
      │
      ▼
  axios.get/post/put/delete('/api/...')   ← relative URL
      │
      ├── Dev:  Vite dev-server proxy (vite.config.js) → http://localhost:5000
      └── Prod: Netlify redirect (netlify.toml / public/_redirects)
                  /api/* → https://shivam-stack-backend.onrender.com/api/:splat
```

Most pages call `axios` directly rather than through a shared service module. The `src/services/` directory contains stub files (`authService.js`, `blogService.js`, `orderService.js`, `paymentService.js`, `productService.js`, `projectService.js`, `axiosInstance.js`) that are currently empty — `socketApi.js` is the only implemented file in that directory, providing a configured Axios instance with interceptors for the socket-related API base.

The global Axios `baseURL` is actually set once, in `src/main.jsx`, based on `VITE_NODE_ENV` and `VITE_API_URL` (see `docs/development.md` for the exact conditional logic).

## Real-time

`useSocket()` (in `src/hooks/`) connects to `VITE_API_URL` via `socket.io-client`, authenticating with whichever token is available from `AuthContext` or `AdminContext`, and exposes the raw socket instance. It disconnects on unmount / token change.

## State management

State is handled entirely through React Context (`AuthContext`, `AdminContext`, `ThemeContext` for dark/light mode, `SidebarContext` for admin sidebar collapse state) plus local component state. There is no Redux store in active use: `src/app/store.js`, `src/app/rootReducer.js`, and `src/reducers/UseReducer.js` exist but are not imported anywhere in the app, and `redux`/`@reduxjs/toolkit` are not dependencies in `package.json`.

## SEO

A shared `SEO` component (`src/components/common/SEO.jsx`) wraps `react-helmet-async` to set per-page title, description, keywords, Open Graph, and Twitter card metadata. Site-wide SEO assets present in the repo: `public/sitemap.xml` (also duplicated at the project root as `sitemap.xml`), `robots.txt`, Google Analytics (`gtag.js`) and Google Search Console verification tags hardcoded into `index.html`.

> **RECOMMENDED ADDITION:** move the Google Analytics measurement ID and site-verification tag out of the hardcoded `index.html` and into environment variables, so different environments (staging/prod) don't share the same analytics stream.

## Deployment topology

```
┌────────────────────┐        ┌────────────────────────────┐
│   Netlify (SPA)     │  /api/*│   Render — backend service   │
│ Shivam_Stack_Frontend│───────▶│ shivam-stack-backend         │
│  (this repository)   │        │  (separate repository)       │
└────────────────────┘        └────────────────────────────┘
```

Netlify serves the built static app and rewrites `/api/*` to the Render-hosted backend, and falls back all other paths to `index.html` for client-side routing (`netlify.toml`, mirrored in `public/_redirects`).

## Not yet implemented (architecturally relevant)

- **Checkout/payment flow** — no gateway integration; `Checkout.jsx`, `PaymentFailed.jsx`, `PaymentSuccess.jsx` are empty and unrouted.
- **Admin analytics, order management, and user management pages** — components exist as empty files; their imports/routes are commented out in `App.jsx`.
- **`Shop.jsx`, `RefundPolicy.jsx`, user `Dashboard.jsx`** — empty, unrouted.

See [Known limitations](../README.md#known-limitations) in the main README for the complete, current list.
