# Security Policy

## Reporting a vulnerability

If you find a security issue in this project, please **do not open a public issue**. Instead, use GitHub's [private vulnerability reporting](../../security/advisories/new) or contact the maintainer directly. You should get a response within a few days.

## Scope and threat model

Keep in mind what this software does by design: it opens a door for **anyone who rings** during the configured time window. That is a feature, not a vulnerability. Relevant security concerns are, for example:

- The Ring refresh token being leaked (through logs, error messages, or files that should be ignored by git/docker)
- The service unlocking outside the configured schedule
- Dependency vulnerabilities

## Hardening recommendations for users

- Never commit or share your `.env` — the refresh token grants full access to your Ring account
- Restrict access to the host machine; anyone who can read `.env` controls your door
- Keep the schedule window as narrow as your use case allows
- Update dependencies regularly (`npm audit`, `npm update`)
