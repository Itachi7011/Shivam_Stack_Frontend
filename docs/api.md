# API Consumption Reference

This document is **not** a specification for the backend API — the backend lives in a separate repository and is not covered here. This is a reference for *how the frontend consumes it*, reconstructed directly from the `axios` calls found in the source, page by page. It exists so a new contributor can find which page is responsible for which network call without grepping the codebase.

There is no OpenAPI/Swagger file in this repository. If one exists in the backend repository, link it here instead of maintaining a second copy.

## Base URL resolution

All relative `/api/*` calls resolve differently depending on environment — see [`docs/architecture.md`](./architecture.md#data-flow) and [`docs/development.md`](./development.md#environment-variable-resolution--note-on-vite_node_env) for the exact logic (Vite dev proxy locally, Netlify redirect in production).

## Endpoints called from the frontend

Grouped by the page/component that calls them. Method and path are taken verbatim from the code; some paths are built from constants (`API_BASE`, `API_URL`) defined per-file rather than a single shared client.

### Public — general

| Method | Path | Called from |
|---|---|---|
| `POST` | `/api/public/newsletter/subscribe` | `pages/public/Home.jsx` |
| `POST` | `${API_URL}/newsletter/subscribe` (`API_URL = "/api/public"`) | `components/layout/Footer.jsx` |
| `GET` | `${API_URL}/contact/info` (`API_URL = "/api/public"`) | `components/layout/Footer.jsx` |
| `POST` | `${API_URL}/contact/submit` (`API_URL = "/api/public"`) | `pages/public/Contact.jsx` |
| `GET` | `${API_URL}/services` (`API_URL = "/api/public"`) | `components/layout/Footer.jsx` |

### Public — blog, projects, case studies, products

| Method | Path | Called from |
|---|---|---|
| `GET` | `${API_BASE}` (`API_BASE = "/api/public/blogs"`) | `pages/public/Blog.jsx` |
| `GET` | `${API_BASE}/slug/${slug}` | `pages/public/Blog.jsx` |
| `GET` | `${API_BASE}` (`API_BASE` built from a template in `Projects.jsx`) | `pages/public/Projects.jsx` |
| `GET` | `${API_BASE}` (`API_BASE = "/api/public"`) | `pages/public/CaseStudies.jsx`, `pages/public/Products/AllProducts.jsx` |

### Public — bookings ("Book a free call")

| Method | Path | Called from |
|---|---|---|
| `GET` | `${API_URL}/available-slots` | `pages/public/BookFreeCall.jsx` |
| `GET` | `${API_URL}/bookings` | `pages/public/BookFreeCall.jsx` |
| `POST` | `${API_URL}/bookings` | `pages/public/BookFreeCall.jsx` |
| `PATCH` | `${API_URL}/bookings/${bookingId}/status` | `pages/public/BookFreeCall.jsx` |
| `DELETE` | `${API_URL}/bookings/${bookingId}` | `pages/public/BookFreeCall.jsx` |

### User authentication

| Method | Path | Called from |
|---|---|---|
| `GET` | `/api/users/profile` | `context/AuthContext.jsx` |
| `POST` | `/api/users/login` | `context/AuthContext.jsx` |
| `POST` | `/api/users/register` | `context/AuthContext.jsx` |
| `POST` | `/api/users/logout` | `context/AuthContext.jsx` |
| `POST` | `/api/users/resend-verification` | `context/AuthContext.jsx` |
| `POST` | `/api/users/verify-email` | `context/AuthContext.jsx` |
| `GET` | `/api/users/activities?limit=10` | `context/AuthContext.jsx` |

### Admin authentication

| Method | Path | Called from |
|---|---|---|
| `GET` | `/api/admin/profile` | `context/AdminContext.jsx` (sent with `Authorization: Bearer <adminToken>`) |
| `POST` | `/api/admin/login` | `context/AdminContext.jsx` |
| `POST` | `/api/admin/logout` | `context/AdminContext.jsx` |

### Admin — content & catalog management

| Method | Path pattern | Called from |
|---|---|---|
| `GET`/`POST`/`PUT`/`DELETE` | `/api/admin/contact-messages/...` | `pages/admin/ManageContactUsMessages.jsx` |
| `DELETE` | `${API_BASE}/${msgId}`, `${API_BASE}/bulk` | `pages/admin/ManageContactUsMessages.jsx` |
| `GET`/`DELETE` | `/api/admin/book-calls/...`, `${API_BASE}/${bookingId}` | `pages/admin/ManageBookFreeCallMessages.jsx` |
| `GET`/`PUT` | `/admin/main-settings` | `pages/admin/MainSettings.jsx` |
| `GET`/`POST`/`PUT`/`DELETE` | `/api/feature/pages/fortunes/...` | `pages/admin/Managecasestudies.jsx` |
| `GET`/`DELETE` | `/api/admin/newsletter/subscribers/...`, `${API_BASE}/${subId}` | `pages/admin/ManageNewsLetterSubscribers.jsx` |

Admin pages for products, product categories, projects, project categories, blog, blog categories, and coupons (`ManageProducts.jsx`, `ManageProductsCategory.jsx`, `ManageProjects.jsx`, `ManageProjectsCategory.jsx`, `ManageBlog.jsx`, `ManageBlogCategory.jsx`, `ManageCoupons.jsx`) each make their own CRUD calls following the same `/api/admin/<resource>` pattern seen above. Refer to each file directly for the exact paths — they were not exhaustively re-transcribed here to avoid this document drifting out of sync with the code; the pattern above is representative.

## Socket.io

`src/hooks/useSocket.js` connects to `VITE_API_URL` (or `http://localhost:5000` if unset) with `transports: ['websocket']` and an `auth: { token }` payload, where `token` is whichever of the user or admin token is currently available. No specific event names are documented here — none were found to be consistently used yet outside the connection setup itself.

## Known gaps

- **No payment/checkout endpoints** — no calls exist for order creation, payment intents, or webhooks; the checkout pages are empty (see [Known limitations](../README.md#known-limitations)).
- **No centralized API client** — most pages define their own `API_BASE`/`API_URL` constant and call `axios` directly rather than importing a shared service (`src/services/*.js` are mostly empty stubs).

If the backend API gains a formal OpenAPI spec, this file should be replaced with a link to it rather than maintained in parallel.
