# ring-intercom-auto-unlock

> Automatically unlock your door or gate when someone rings your **Ring Intercom** — a lightweight, self-hosted Node.js service. **No Home Assistant or Homebridge required.**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js >= 20](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue.svg)](CONTRIBUTING.md)

🌍 [Italiano](README.it.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · [Nederlands](README.nl.md)

Perfect for shops, offices, B&Bs and anyone who wants the front door or gate to open by itself during business hours — without picking up the phone every time the buzzer rings.

## Features

- 🔔 **Listens for ding events** in real time via Ring push notifications
- ⏱️ **Random delay** before unlocking (default 5–20 s) so it feels like a human buzzed you in
- 📅 **Schedule**: only active on the days and hours you choose, with support for multiple windows per day — e.g. `8-12,13-20` to pause for lunch (default Mon–Fri, 8:00–20:00, timezone-aware — works even if your server runs on UTC)
- 🔁 **Cooldown** so a double ring doesn't open the door twice
- 🔑 **Automatic refresh-token rotation** — authenticate once, runs forever
- 📝 **Detailed logging** with `info`/`debug` levels, hourly heartbeat, offline and low-battery warnings
- 🐳 **Docker-ready** — runs on any NAS (Synology/QNAP), VPS, Raspberry Pi or free-tier cloud VM
- 🪶 **Tiny**: one file, two dependencies, ~100 MB of RAM

## What you need

- A [Ring Intercom](https://www.amazon.it/s?k=ring+intercom) (~€60, audio version is enough) installed on your existing intercom system
- Somewhere to run the service 24/7 — any of:
  - your NAS or a Raspberry Pi you already own
  - a free [Oracle Cloud Always Free](https://www.oracle.com/cloud/free/) VM (what I use — genuinely free forever)
  - a small VPS: [Hetzner Cloud](https://www.hetzner.com/cloud) (~€4/month) or [DigitalOcean](https://www.digitalocean.com)

## How it works

```
Ring Intercom  ──ding──▶  this service  ──wait 5–20s──▶  unlock()  ──▶  door opens
                            │
                            └── ignores the ring if outside your schedule
```

The service uses the excellent [ring-client-api](https://github.com/dgreif/ring) to subscribe to your intercom's push notifications. When someone rings during the configured time window, it waits a random delay and sends the same unlock command the Ring app uses.

## Quick start

Requires Node.js 20+ and a Ring Intercom already set up in the Ring app.

```sh
git clone https://github.com/mzat-dev/ring-intercom-auto-unlock.git
cd ring-intercom-auto-unlock
npm install

# 1. Get a Ring refresh token (asks for email, password and 2FA code)
npx ring-auth-cli

# 2. Configure
cp .env.example .env
#    paste the token into RING_REFRESH_TOKEN=...

# 3. Run
npm start
```

Ring the buzzer: you should see the `DING` in the log and, a few seconds later, `GATE OPENED`.

## Deploy with Docker (recommended)

```sh
docker compose up -d --build
docker compose logs -f
```

Works out of the box on Synology (Container Manager), QNAP (Container Station), any VPS, or a free [Oracle Cloud Always Free](https://www.oracle.com/cloud/free/) VM.

> **Important:** the `.env` file is mounted as a **writable** volume. Ring rotates the refresh token periodically and the service saves the new one there. Don't redeploy from an old copy of `.env` — the old token will have been invalidated.

## Configuration

Everything is configured via `.env`:

| Variable            | Default       | Description                                            |
| ------------------- | ------------- | ------------------------------------------------------ |
| `RING_REFRESH_TOKEN`| —             | Ring auth token (get it with `npx ring-auth-cli`)      |
| `MIN_DELAY_SECONDS` | `5`           | Minimum delay before unlocking                         |
| `MAX_DELAY_SECONDS` | `20`          | Maximum delay before unlocking                         |
| `COOLDOWN_SECONDS`  | `60`          | Ignore further rings for N seconds after an unlock     |
| `ACTIVE_DAYS`       | `1,2,3,4,5`   | Active days (1 = Monday … 7 = Sunday)                  |
| `ACTIVE_HOURS`      | `8-20`        | One or more hour ranges, comma-separated. Start inclusive, end exclusive: `8-20` means 8:00–19:59. Use `8-12,13-20` to pause for lunch |
| `TIMEZONE`          | `Europe/Rome` | IANA timezone used to evaluate the schedule            |
| `LOG_LEVEL`         | `info`        | `info` or `debug` (adds ring-client-api internal logs) |
| `HEARTBEAT_MINUTES` | `60`          | Log an "I'm alive" line every N minutes (0 = never)    |

## FAQ

**Does it work with the audio-only Ring Intercom?**
Yes — it's what this project was built on. Video models exposed as intercom handsets work too.

**Do I need a Ring subscription?**
No. Unlocking doesn't require a Ring Protect plan.

**The first run logs `PHONE_REGISTRATION_ERROR`.**
Harmless — push registration retries and succeeds on the second attempt. It only happens on a fresh token.

**Why a random delay instead of opening instantly?**
An instant unlock makes it obvious a bot opened the door. A short human-like delay also gives you time to glance at who rang, if you keep notifications on.

**Is this safe?**
Understand what you're enabling: during the active window the door opens for **anyone** who rings, with no confirmation. Use the schedule to limit exposure, and only use this where an unattended open door is acceptable.

## Security

The refresh token in `.env` grants full access to your Ring account — never commit it (it's in `.gitignore`) and be careful where you host the service. See [SECURITY.md](SECURITY.md) for reporting vulnerabilities.

## Support this project

If this saved you from answering the buzzer fifty times a day:

- ⭐ Star the repo — it helps others find it
- ☕ [Buy me a coffee](https://buymeacoffee.com/mzat.dev)

## Contributing

Issues and pull requests are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md).

## Disclaimer

This is an **unofficial** project, not affiliated with, endorsed by, or connected to Ring LLC or Amazon. It relies on the unofficial Ring API via [ring-client-api](https://github.com/dgreif/ring); Ring may change or break that API at any time. Automatic unlocking is done **at your own risk** — the authors accept no liability for unauthorized access, property loss or damage resulting from the use of this software.

## License

[MIT](LICENSE)
