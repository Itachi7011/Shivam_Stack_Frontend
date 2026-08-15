# Shivam Stack — Frontend

A React + Vite frontend for a full‑stack developer's service business: a public marketing site (services, portfolio, blog, case studies, products), a customer-facing user portal (auth, orders, downloads, messages), and an admin dashboard for running the business (content, products, projects, coupons, subscribers, and inbound messages).

**Live site:** https://shivam-webstack.netlify.app/
**Backend API:** deployed separately (not part of this repository) at `https://shivam-stack-backend.onrender.com`

---

## Table of Contents

- [Why this project exists](#why-this-project-exists)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Available scripts](#available-scripts)
- [Local development](#local-development)
- [Deployment](#deployment)
- [API documentation](#api-documentation)
- [Testing](#testing)
- [Security](#security)
- [Known limitations](#known-limitations)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Why this project exists

Independent developers and small dev studios need more than a static portfolio: they need a way to list services, showcase projects and case studies, publish a blog, sell digital products (templates, ebooks, resources), take bookings for calls, and manage all of it from an admin panel — without paying for a full SaaS website builder.

This repository is the **frontend** half of that system: a single React application that serves three distinct audiences (public visitors, logged-in customers, and the site admin) from one codebase, talking to a separate Node/Express-style backend over a REST API and Socket.io.

## Solution

Rather than three separate apps, the frontend uses route-based sectioning (`/`, `/user/*`, `/admin/*`) with two independent authentication contexts (`AuthContext` for customers, `AdminContext` for the admin), each backed by its own login/register/password-reset flow and its own protected layout (navbar + sidebar for admin, navbar + footer for public/user).

## Features

**Public site**
- Marketing pages: Home, About, Services (9 individual service pages + overview), Portfolio, Projects, Case Studies, Blog, Contact
- Digital products catalog: code templates, ebooks & guides, developer resources
- "Book a free call" flow (Calendly-linked)
- SEO: per-page `<Helmet>` metadata via a shared `SEO` component, `sitemap.xml`, `robots.txt`, Google Analytics (gtag) and Google Search Console verification wired into `index.html`
- Newsletter subscription (public endpoint call from the Home page)

**User portal** (`/user/*`)
- Registration, login, forgot/reset password (cookie/token-based auth via `AuthContext`)
- Profile and account settings
- Order history and downloads pages
- In-app messages

**Admin dashboard** (`/admin/*`)
- Separate registration, login, forgot/reset password (`AdminContext`, distinct from the user auth flow)
- Dashboard with charts (Recharts)
- Content management: blog posts + blog categories
- Catalog management: products + product categories, projects + project categories
- Coupons management
- Newsletter subscriber list
- Inbound message management: contact-form messages, "book a free call" messages, general messages
- Site-wide settings page
- Route guarding via a `RequireAdmin` wrapper that reads `AdminContext` state
- Export tooling available in the stack: `jspdf` / `jspdf-autotable` (PDF export) and `xlsx` (spreadsheet export)

**Real-time**
- `socket.io-client` is wired up (`useSocket` hook, `socketApi.js` service) for authenticated real-time features

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build tool | Vite 7 (`@vitejs/plugin-react-swc`) |
| Routing | React Router 7 |
| State/data | React Context API (`AuthContext`, `AdminContext`, `ThemeContext`, `SidebarContext`) |
| HTTP client | Axios |
| Real-time | Socket.io client |
| Charts | Recharts |
| SEO | `react-helmet-async` |
| Alerts/UI feedback | SweetAlert2 |
| Icons | lucide-react |
| Exports | jsPDF + jspdf-autotable (PDF), SheetJS/`xlsx` (spreadsheets) |
| Linting | ESLint 9 (flat config) |
| Hosting | Netlify (SPA fallback + API reverse proxy via `netlify.toml`) |

This is a **JavaScript** project (`.jsx`/`.js`). The `@types/react` and `@types/react-dom` dev dependencies are present for editor IntelliSense only — there is no `tsconfig.json` and no TypeScript source in the repo.

## Architecture

The frontend is a single-page application with three route domains sharing one React tree:

```
┌─────────────────────────────────────────────────────────┐
│                        App.jsx                           │
│  <AuthProvider> <AdminProvider> <SidebarProvider>         │
│                      <Router>                             │
├─────────────────────────────────────────────────────────┤
│  Public routes        User routes          Admin routes   │
│  /, /about, /services  /user/login          /admin/login   │
│  /portfolio, /blog     /user/register       /admin/dashboard│
│  /projects, /contact   /user/profile        /admin/manage-* │
│  /products/*           /user/orders         /admin/main-settings│
│  /book-free-call       /user/downloads                     │
│                        /user/messages                      │
├─────────────────────────────────────────────────────────┤
│  Navbar (public/user)  ·  AdminNavbar + AdminSidebar (admin)│
│  Footer (hidden on /admin/*)                               │
└─────────────────────────────────────────────────────────┘
                          │  axios (withCredentials)
                          │  socket.io-client
                          ▼
        Backend API — separate repository/service
        (Node/Express-style REST API, cookie/JWT auth)
        https://shivam-stack-backend.onrender.com
```

Two independent contexts gate access:
- **`AuthContext`** — fetches the current customer via `GET /api/users/profile`, exposes `login`/`register`/`logout`.
- **`AdminContext`** — fetches the current admin via `GET /api/admin/profile` (Bearer token from `localStorage`), exposes admin auth state to `RequireAdmin` and `AdminSidebar`.

`NavbarWrapper` and `AdminLayoutWrapper` in `App.jsx` switch the chrome (navbar/sidebar/footer) based on the current path and whichever context reports an authenticated session.

In local development, `vite.config.js` proxies `/api` to `http://localhost:5000`. In production, `netlify.toml` rewrites `/api/*` to the deployed backend on Render, and falls back all other routes to `index.html` for client-side routing.

> **RECOMMENDED ADDITION:** a rendered architecture diagram (the block diagram above, exported as PNG/SVG) under `docs/architecture.md` or `docs/assets/`.

## Project structure

```
src/
├── app/                  # Redux-style scaffold (rootReducer.js, store.js) — present but empty; Redux is not installed or used
├── components/
│   ├── common/           # SEO.jsx (in use); AdminRoute.jsx, Pagination.jsx, ProtectedRoute.jsx (empty scaffolds, unused)
│   ├── Error/             # Error404.jsx
│   └── layout/            # Navbar, Footer, AdminNavbar, AdminSidebar, FloatingActionButton, RequireAdmin
├── config/                # api.js — helper for resolving API base by hostname
├── context/                # AuthContext, AdminContext, ThemeContext, SidebarContext (all in use); UserContext.js (minimal)
├── css/                   # Hand-written CSS, organized by admin/ · components/ · public/ · user/
├── hooks/                  # useSocket.js (in use); useAuth.js, useDebounce.js, useFetch.js, usePagination.js (empty scaffolds, unused)
├── images/                  # Static image assets used across public pages
├── pages/
│   ├── admin/                # Admin dashboard, content/catalog managers, settings, auth
│   ├── checkout/              # Checkout, PaymentFailed, PaymentSuccess — empty scaffolds, no routes registered yet
│   ├── public/                 # Marketing pages + Products/ + Services/ subpages
│   └── user/                    # User portal pages + auth
├── reducers/                     # UseReducer.js — a localStorage-backed user reducer, currently unused (not wired into any component)
├── routes/                        # AppRoutes.jsx — empty, unused; routing is defined directly in App.jsx
├── services/                       # authService, blogService, orderService, paymentService, productService, projectService, axiosInstance — all empty scaffolds; socketApi.js is the one implemented service
└── utils/                           # constants.js, formatPrice.js, helpers.js, validate.js — empty scaffolds, unused
```

Several files above are present as scaffolding but contain no code yet. They're listed accurately rather than silently omitted — see [Known limitations](#known-limitations).

## Getting started

### Prerequisites

- Node.js (LTS recommended)
- npm
- A running instance of the companion backend API (separate repository), or access to the deployed one

### Installation

```bash
git clone https://github.com/Itachi7011/Shivam_Stack_Frontend.git
cd Shivam_Stack_Frontend
npm install
```

### Environment variables

Copy the example file and fill in real values:

```bash
cp .env.example .env
```

See [`.env.example`](./.env.example) for the full list with descriptions. In short:

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Base URL of the backend API / Socket.io server |
| `VITE_NODE_ENV` | Environment flag read directly in `src/main.jsx` |
| `VITE_Email` | Default contact email shown across the site |
| `VITE_Mobile` | Contact phone number |
| `VITE_Github`, `VITE_Twitter`, `VITE_LinkedIn`, `VITE_Insta`, `VITE_Facebook`, `VITE_Whatsapp`, `VITE_Youtube` | Social links used in the Footer / Home / Contact / BookFreeCall pages |
| `VITE_CALENDLY_URL` | Calendly link used by the "Book a free call" feature |
| `VITE_RESUME_URL` | Resume file URL/path linked from the Home page |

None of these are secrets — they configure public-facing display content, not credentials.

## Available scripts

These are exactly the scripts defined in `package.json` — no others exist yet:

```bash
npm run dev       # start the Vite dev server
npm run build     # production build to dist/
npm run lint      # run ESLint across the project
npm run preview   # preview the production build locally
```

There is currently no `test` or `typecheck` script — see [Testing](#testing).

## Local development

```bash
npm run dev
```

The dev server proxies any request to `/api/*` to `http://localhost:5000` (configured in `vite.config.js`), so the app expects the backend to be running locally on port 5000 unless `VITE_API_URL` / `.env` values are changed.

## Deployment

The app is configured for **Netlify**:

- `netlify.toml` rewrites `/api/*` requests to the deployed backend on Render, and falls back all non-file routes to `index.html` (required for client-side routing with React Router).
- `public/_redirects` mirrors the same rules for platforms that read that file instead of `netlify.toml`.

```bash
npm run build
```

Deploy the resulting `dist/` directory, or connect the repository to Netlify directly for git-based deploys.

## API documentation

The frontend consumes a REST API and a Socket.io server hosted separately. There is no OpenAPI/Swagger spec in this repository (the API itself lives in another repo). `docs/api.md` in this repo documents the frontend's *consumption* of that API — which endpoints are called from which pages — reconstructed from the actual `axios` calls in the code, not the backend's own documentation.

## Testing

**RECOMMENDED ADDITION.** There is no test runner, test files, or `test` script in the project today. No testing claims are made in this README because none would be verifiable. Introducing Vitest + React Testing Library for component/unit tests, and Playwright/Cypress for critical user flows (auth, checkout once implemented), would be a reasonable next step.

## Security

See [`SECURITY.md`](./SECURITY.md) for how to report a vulnerability. In short: this is a portfolio/business frontend without its own security disclosure infrastructure yet — please report privately rather than opening a public issue.

## Known limitations

Documented honestly rather than glossed over:

- **Checkout is not implemented.** `src/pages/checkout/Checkout.jsx`, `PaymentFailed.jsx`, and `PaymentSuccess.jsx` exist as empty files and have no routes registered in `App.jsx`. No payment gateway (Razorpay/Stripe/etc.) integration exists in this codebase.
- **Several admin pages are scaffolded but not wired up:** `Analytics.jsx`, `ManageOrders.jsx`, and `ManageUsers.jsx` are empty, and their routes/imports are commented out in `App.jsx`.
- **`src/pages/public/Shop.jsx`, `src/pages/public/RefundPolicy.jsx`, and `src/pages/user/Dashboard.jsx`** are empty with no routes registered.
- **The `src/services/*` layer is mostly unimplemented.** `authService.js`, `axiosInstance.js`, `blogService.js`, `orderService.js`, `paymentService.js`, `productService.js`, and `projectService.js` are all empty files. In practice, pages call `axios` directly rather than going through a shared service layer. `socketApi.js` is the one exception with real implementation.
- **`src/hooks/useAuth.js`, `useDebounce.js`, `useFetch.js`, `usePagination.js`** are empty and unused.
- **`src/utils/constants.js`, `formatPrice.js`, `helpers.js`, `validate.js`** are empty and unused.
- **`src/app/rootReducer.js`, `src/app/store.js`, and `src/reducers/UseReducer.js`** suggest a Redux-style state layer was planned, but Redux is not a dependency and none of these files are wired into the app. State is currently handled entirely through React Context.
- **`src/routes/AppRoutes.jsx`** and **`src/components/common/AdminRoute.jsx`, `Pagination.jsx`, `ProtectedRoute.jsx`** are empty and unused; routing lives directly in `App.jsx` and admin route protection is handled by `RequireAdmin.jsx` instead.
- **No automated tests** exist in the repository (see [Testing](#testing)).
- **No CI pipeline** currently runs on this repository; see the CI workflow recommendation in `docs/development.md`.

None of the above are described elsewhere in this README as implemented — they're listed here for transparency and as a starting point for contributors picking up "good first issue" work.

## Roadmap

See the [Roadmap](#roadmap-1) section below for the full breakdown of completed, in-progress, and future work.

## Contributing

Contributions are welcome. Please read [`CONTRIBUTING.md`](./CONTRIBUTING.md) before opening a pull request, and check [Known limitations](#known-limitations) above for good starting points.

## License

Licensed under the [MIT License](./LICENSE).
