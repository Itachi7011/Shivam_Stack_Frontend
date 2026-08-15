# Contributing to Shivam Stack — Frontend

Thanks for your interest in contributing. This is primarily a personal/business project, but external contributions (bug fixes, documentation, small features) are welcome.

## Before you start

- Check [Known limitations](./README.md#known-limitations) in the README — several files in the repo are intentional empty scaffolds (services, hooks, utils, checkout pages). These are good candidates for a first contribution, but please open an issue first to confirm scope before building out a large feature, since some of these may already be planned or partially designed elsewhere.
- For anything beyond a small fix, open an issue describing what you want to change before writing code, to avoid duplicated or wasted effort.

## Development setup

```bash
git clone https://github.com/Itachi7011/Shivam_Stack_Frontend.git
cd Shivam_Stack_Frontend
npm install
cp .env.example .env
npm run dev
```

See [`docs/development.md`](./docs/development.md) for full details, including a note on the `VITE_NODE_ENV` / `VITE_API_URL` resolution logic.

You'll also need a running instance of the companion backend (separate repository) for most features to work end-to-end. Static/marketing pages will render without it; anything that fetches data will not.

## Making changes

1. Fork the repository and create a branch from `main`:
   ```bash
   git checkout -b fix/short-description
   ```
2. Make your changes.
3. Run the linter before committing:
   ```bash
   npm run lint
   ```
4. Confirm the app still builds:
   ```bash
   npm run build
   ```
5. Commit with a clear message describing *what* and *why*.
6. Push and open a pull request against `main`, filling out the [pull request template](./.github/pull_request_template.md).

## Code style

- Follow the existing ESLint configuration (`eslint.config.js`) — `npm run lint` must pass.
- Match the surrounding code's patterns (Context API for state, direct `axios` calls in page components) rather than introducing a new pattern in an isolated PR. If you think a broader refactor (e.g., centralizing API calls into `src/services/`) is worthwhile, raise it as an issue first so it can be discussed as its own piece of work.
- CSS is organized by section (`css/admin/`, `css/components/`, `css/public/`, `css/user/`) — keep new styles in the matching folder.

## Reporting bugs

Use the [bug report template](./.github/ISSUE_TEMPLATE/bug_report.md). Include steps to reproduce, what you expected, and what actually happened.

## Suggesting features

Use the [feature request template](./.github/ISSUE_TEMPLATE/feature_request.md).

## Security issues

Do not open a public issue for a security vulnerability — see [`SECURITY.md`](./SECURITY.md).

## Code of Conduct

This project follows the [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you agree to uphold it.
