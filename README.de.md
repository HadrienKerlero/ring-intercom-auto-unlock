# ring-intercom-auto-unlock

> Öffnet automatisch deine Tür oder dein Tor, wenn jemand an deinem **Ring Intercom** klingelt — ein leichtgewichtiger, selbst gehosteter Node.js-Dienst. **Kein Home Assistant, kein Homebridge nötig.**

🌍 [English](README.md) · [Italiano](README.it.md) · [Français](README.fr.md) · [Español](README.es.md) · [Nederlands](README.nl.md)

Ideal für Läden, Büros, Ferienwohnungen und alle, die möchten, dass sich die Tür während der Öffnungszeiten von selbst öffnet — ohne jedes Mal zum Hörer zu greifen.

## Funktionen

- 🔔 **Klingel-Ereignisse in Echtzeit** über Ring-Push-Benachrichtigungen
- ⏱️ **Zufällige Verzögerung** vor dem Öffnen (Standard 5–20 s), damit es wie ein Mensch wirkt
- 📅 **Zeitplan**: nur an den gewählten Tagen und Uhrzeiten aktiv, mit Unterstützung für mehrere Zeitfenster pro Tag — z. B. `8-12,13-20` für die Mittagspause (Standard Mo–Fr, 8:00–20:00, mit expliziter Zeitzone — funktioniert auch auf UTC-Servern)
- 🔁 **Cooldown**: doppeltes Klingeln öffnet nicht zweimal
- 🔑 **Automatische Token-Rotation** — einmal anmelden, läuft für immer
- 📝 **Ausführliches Logging** (`info`/`debug`), stündlicher Heartbeat, Warnungen bei Offline-Gerät und schwachem Akku
- 🐳 **Docker-ready** — läuft auf NAS (Synology/QNAP), VPS, Raspberry Pi oder kostenloser Cloud-VM
- 🪶 **Winzig**: eine Datei, zwei Abhängigkeiten, ~100 MB RAM

## Was du brauchst

- Ein [Ring Intercom](https://www.amazon.de/s?k=ring+intercom) (~60 €, die Audio-Version reicht)
- Einen Ort, an dem der Dienst 24/7 läuft: dein NAS oder Raspberry Pi, eine kostenlose [Oracle Cloud Always Free](https://www.oracle.com/cloud/free/) VM, oder ein kleiner VPS bei [Hetzner Cloud](https://www.hetzner.com/cloud) (~4 €/Monat)

## Schnellstart

Benötigt Node.js 20+ und ein in der Ring-App eingerichtetes Ring Intercom.

```sh
git clone https://github.com/mzat-dev/ring-intercom-auto-unlock.git
cd ring-intercom-auto-unlock
npm install

# 1. Ring-Refresh-Token holen (fragt E-Mail, Passwort und 2FA-Code ab)
npx ring-auth-cli

# 2. Konfigurieren
cp .env.example .env
#    Token bei RING_REFRESH_TOKEN=... einfügen

# 3. Starten
npm start
```

## Deployment mit Docker (empfohlen)

```sh
docker compose up -d --build
docker compose logs -f
```

> **Wichtig:** Die `.env`-Datei ist als **beschreibbares** Volume eingebunden: Ring rotiert den Refresh-Token regelmäßig und der Dienst speichert den neuen dort. Nie von einer alten Kopie der `.env` neu deployen.

## Konfiguration

Die vollständige Tabelle steht im [englischen README](README.md#configuration). Wichtigste Variablen: `MIN/MAX_DELAY_SECONDS` (Verzögerung), `ACTIVE_DAYS` + `ACTIVE_HOURS` + `TIMEZONE` (Zeitfenster, z. B. `8-12,13-20`), `COOLDOWN_SECONDS`, `LOG_LEVEL`.

## Achtung

Während des aktiven Zeitfensters öffnet sich die Tür für **jeden**, der klingelt — ohne Bestätigung. Halte das Zeitfenster so eng wie möglich und prüfe, ob das für deinen Einsatzzweck vertretbar ist.

## Projekt unterstützen

- ⭐ Gib dem Repo einen Stern
- ☕ [Spendier mir einen Kaffee](https://buymeacoffee.com/mzat.dev)

## Haftungsausschluss

**Inoffizielles** Projekt, nicht mit Ring LLC oder Amazon verbunden. Basiert auf der inoffiziellen Ring-API via [ring-client-api](https://github.com/dgreif/ring), die sich jederzeit ändern kann. Automatisches Öffnen erfolgt **auf eigenes Risiko**.

## Lizenz

[MIT](LICENSE)
