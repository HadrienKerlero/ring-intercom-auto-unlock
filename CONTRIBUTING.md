# Contributing

Thanks for your interest in improving ring-intercom-auto-unlock!

## Reporting bugs

Open an [issue](../../issues) and include:

- What happened and what you expected
- Relevant log output (run with `LOG_LEVEL=debug`) — **redact your refresh token** if it appears anywhere
- Your environment: Node.js version, Docker or bare metal, intercom model (audio/video)

## Suggesting features

Open an issue describing the use case, not just the solution. This project aims to stay small and focused: one job, done reliably. Features that require a database, a web UI or cloud services probably belong in a fork or a separate project.

## Pull requests

1. Fork and create a branch from `main`
2. Keep the change minimal and consistent with the existing style (plain JavaScript, ESM, no build step)
3. Test locally against a real intercom if you can — there is no mock of the Ring API
4. Describe **what** the PR changes and **why** in the description

For anything non-trivial, open an issue first so we can discuss the approach before you invest time.

## Development setup

```sh
npm install
cp .env.example .env   # add your own token via: npx ring-auth-cli
npm start
```

There is no test suite yet — contributions welcome on that front too (the schedule logic in `isWithinSchedule()` is a good candidate for unit tests).

## Security issues

Please **do not** open public issues for security vulnerabilities — see [SECURITY.md](SECURITY.md).
