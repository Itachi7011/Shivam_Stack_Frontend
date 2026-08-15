# Development Guide

## Prerequisites

- Node.js (LTS)
- npm
- The companion backend running locally on port 5000, or a reachable deployed instance (see `VITE_API_URL`)

## Setup

```bash
git clone https://github.com/Itachi7011/Shivam_Stack_Frontend.git
cd Shivam_Stack_Frontend
npm install
cp .env.example .env   # then fill in values, see .env.example
npm run dev
```

## Scripts

Only the scripts actually defined in `package.json` are listed — nothing here is aspirational:

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `vite` | Start the dev server with HMR |
| `npm run build` | `vite build` | Production build to `dist/` |
| `npm run lint` | `eslint .` | Lint the project (flat ESLint config, `eslint.config.js`) |
| `npm run preview` | `vite preview` | Serve the production build locally for a final check |

There is no `test` or `typecheck` script yet — see [Testing](../README.md#testing) in the main README.

## Environment variable resolution — note on `VITE_NODE_ENV`

`src/main.jsx` sets the global axios `baseURL` like this:

```js
axios.defaults.baseURL =
  import.meta.env.VITE_NODE_ENV === "deployment"
    ? "http://localhost:5000"
    : import.meta.env.VITE_API_URL || "http://localhost:5000";
```

Documented as-is: when `VITE_NODE_ENV` is exactly the string `"deployment"`, the base URL is hardcoded to `localhost:5000`; otherwise it falls back to `VITE_API_URL`. This is worth being aware of when setting environment variables in Netlify — double-check which value you're setting for `VITE_NODE_ENV` in each environment, since the branch that reads `"deployment"` does not use `VITE_API_URL` at all.

Separately, `src/config/api.js` contains a second, independent way of resolving the API base (checking `window.location.hostname` for `netlify.app`), which is not the same logic used in `main.jsx`. Both exist in the codebase; which one an individual page effectively uses depends on whether it goes through `axios.defaults.baseURL` (set globally in `main.jsx`) or explicitly imports `getApiBase()` from `config/api.js`.

## Local development notes

- The Vite dev server proxies `/api` requests to `http://localhost:5000` (see `vite.config.js`), independent of the `VITE_API_URL` env variable — useful to know if a proxy and an env variable ever disagree.
- Cookie-based auth (`withCredentials: true`) is used for both the user and admin flows in most places, though `AdminContext.fetchAdmin()` currently sends the admin token as an `Authorization: Bearer` header read from `localStorage` rather than relying on the cookie — worth keeping in mind if debugging admin session issues.
- Two authentication contexts exist side by side (`AuthContext` for `/user/*`, `AdminContext` for `/admin/*`) and are intentionally independent — logging into one does not affect the other.

## Code style

- ESLint flat config (`eslint.config.js`) with `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`. Run `npm run lint` before opening a PR.
- No Prettier configuration is present in the repo. **RECOMMENDED ADDITION:** add Prettier (or an ESLint formatting ruleset) if consistent formatting across contributors becomes a priority.

## Editor/tooling notes (inherited from the original Vite template)

The project was scaffolded from Vite's official React template. The original template README content is preserved here rather than deleted:

> This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
>
> Currently, two official plugins are available:
> - `@vitejs/plugin-react` uses Babel (or oxc when used in rolldown-vite) for Fast Refresh
> - `@vitejs/plugin-react-swc` uses SWC for Fast Refresh — **this is the plugin actually used in this project** (see `vite.config.js`)
>
> **React Compiler:** the React Compiler is currently not compatible with SWC. See the [tracking issue](https://github.com/vitejs/vite-plugin-react/issues/428) for progress.
>
> **Expanding the ESLint configuration:** if developing a production application, the Vite team recommends using TypeScript with type-aware lint rules. See the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) and [`typescript-eslint`](https://typescript-eslint.io) for how to integrate that. This project has not adopted TypeScript (see [Tech stack](../README.md#tech-stack) in the main README).

## Pull request workflow

See [`CONTRIBUTING.md`](../CONTRIBUTING.md) for the full contribution process, and [`.github/pull_request_template.md`](../.github/pull_request_template.md) for what to include in a PR description.
