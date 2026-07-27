# ring-intercom-auto-unlock

> Opent automatisch je deur of poort wanneer iemand aanbelt bij je **Ring Intercom** — een lichtgewicht, zelf-gehoste Node.js-service. **Geen Home Assistant of Homebridge nodig.**

🌍 [English](README.md) · [Italiano](README.it.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md)

Perfect voor winkels, kantoren, B&B's en iedereen die wil dat de deur vanzelf opengaat tijdens openingstijden — zonder telkens de intercom op te nemen.

## Functies

- 🔔 **Luistert naar belsignalen** in realtime via Ring-pushmeldingen
- ⏱️ **Willekeurige vertraging** voor het openen (standaard 5–20 s), zodat het menselijk aanvoelt
- 📅 **Schema**: alleen actief op de dagen en uren die jij kiest, met ondersteuning voor meerdere tijdvensters per dag — bijv. `8-12,13-20` voor de lunchpauze (standaard ma–vr, 8:00–20:00, met expliciete tijdzone — werkt ook op een UTC-server)
- 🔁 **Cooldown**: twee keer bellen opent niet twee keer
- 🔑 **Automatische tokenrotatie** — één keer inloggen, draait voor altijd
- 📝 **Uitgebreide logging** (`info`/`debug`), uurlijkse heartbeat, waarschuwingen bij offline apparaat en lage batterij
- 🐳 **Docker-ready** — draait op NAS (Synology/QNAP), VPS, Raspberry Pi of gratis cloud-VM
- 🪶 **Piepklein**: één bestand, twee dependencies, ~100 MB RAM

## Wat je nodig hebt

- Een [Ring Intercom](https://www.amazon.nl/s?k=ring+intercom) (~€60, de audioversie volstaat)
- Een plek waar de service 24/7 draait: je NAS of Raspberry Pi, een gratis [Oracle Cloud Always Free](https://www.oracle.com/cloud/free/) VM, of een kleine VPS bij [Hetzner Cloud](https://www.hetzner.com/cloud) (~€4/maand)

## Snel starten

Vereist Node.js 20+ en een Ring Intercom die al in de Ring-app is ingesteld.

```sh
git clone https://github.com/mzat-dev/ring-intercom-auto-unlock.git
cd ring-intercom-auto-unlock
npm install

# 1. Haal een Ring-refresh-token op (vraagt e-mail, wachtwoord en 2FA-code)
npx ring-auth-cli

# 2. Configureer
cp .env.example .env
#    plak het token bij RING_REFRESH_TOKEN=...

# 3. Start
npm start
```

## Deployen met Docker (aanbevolen)

```sh
docker compose up -d --build
docker compose logs -f
```

> **Belangrijk:** het `.env`-bestand is gemount als **schrijfbaar** volume: Ring roteert het refresh token regelmatig en de service slaat het nieuwe daar op. Deploy nooit opnieuw vanaf een oude kopie van `.env`.

## Configuratie

De volledige tabel staat in de [Engelse README](README.md#configuration). Belangrijkste variabelen: `MIN/MAX_DELAY_SECONDS` (vertraging), `ACTIVE_DAYS` + `ACTIVE_HOURS` + `TIMEZONE` (tijdvensters, bijv. `8-12,13-20`), `COOLDOWN_SECONDS`, `LOG_LEVEL`.

## Let op

Tijdens het actieve venster gaat de deur open voor **iedereen** die aanbelt, zonder bevestiging. Houd het tijdvenster zo krap mogelijk en beoordeel of dat acceptabel is voor jouw situatie.

## Steun het project

- ⭐ Geef de repo een ster
- ☕ [Trakteer me op een koffie](https://buymeacoffee.com/mzat.dev)

## Disclaimer

**Onofficieel** project, niet verbonden aan Ring LLC of Amazon. Gebaseerd op de onofficiële Ring-API via [ring-client-api](https://github.com/dgreif/ring), die elk moment kan veranderen. Automatisch openen is **op eigen risico**.

## Licentie

[MIT](LICENSE)
