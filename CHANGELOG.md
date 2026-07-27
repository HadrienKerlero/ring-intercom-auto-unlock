# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0] - 2026-07-27

### Added

- Listen for Ring Intercom ding events via push notifications
- Unlock the door after a configurable random delay (default 5–20 s)
- Day/hour schedule with explicit timezone (default Mon–Fri 8:00–20:00, Europe/Rome)
- Cooldown to prevent double unlocks on repeated rings
- Automatic persistence of rotated Ring refresh tokens to `.env`
- Detailed logging (`info`/`debug`), hourly heartbeat, offline and low-battery warnings
- Docker and docker-compose deployment
