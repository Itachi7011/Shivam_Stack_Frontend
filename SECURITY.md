# Security Policy

## Supported versions

This project does not yet follow a formal versioning/release scheme (`package.json` version is `0.0.0`). Security fixes will be applied to the `main` branch.

## Reporting a vulnerability

If you discover a security vulnerability in this repository, please **do not open a public GitHub issue**. Instead:

1. Use GitHub's [private vulnerability reporting](https://github.com/Itachi7011/Shivam_Stack_Frontend/security/advisories/new) feature if enabled on this repository, or
2. Email the maintainer directly at the contact address listed on the [live site](https://shivam-webstack.netlify.app/contact).

Please include:
- A description of the vulnerability and its potential impact
- Steps to reproduce (proof-of-concept code if applicable)
- Any suggested remediation, if you have one

## Scope

This repository is the **frontend only**. It renders UI, manages client-side routing and auth state, and calls a separately hosted backend API. Vulnerabilities in the backend service (`shivam-stack-backend`) should be reported to that repository/maintainer instead, if it is separately public.

Frontend-relevant concerns in scope here include (but aren't limited to):
- XSS via unsanitized rendering of user-supplied content
- Insecure handling of auth tokens (e.g. the admin token currently stored in `localStorage` — see `docs/architecture.md` for how auth is implemented)
- Dependency vulnerabilities surfaced by `npm audit`

## Response

This is currently a small, individually maintained project without a dedicated security team or SLA. Reports will be acknowledged and investigated on a best-effort basis. Please be patient, and thank you for reporting responsibly.
