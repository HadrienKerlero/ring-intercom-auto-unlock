# ring-intercom-auto-unlock

> Apre automaticamente la porta o il cancello quando qualcuno suona il tuo **Ring Intercom** — servizio Node.js leggero e self-hosted. **Non serve Home Assistant né Homebridge.**

🌍 [English](README.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · [Nederlands](README.nl.md)

Perfetto per negozi, uffici, B&B e per chiunque voglia che la porta si apra da sola in orario di apertura, senza rispondere al citofono ogni volta.

## Funzionalità

- 🔔 **Ascolta i ding** in tempo reale tramite le notifiche push di Ring
- ⏱️ **Ritardo casuale** prima dell'apertura (default 5–20 s), così sembra che qualcuno abbia risposto davvero
- 📅 **Fascia oraria**: attivo solo nei giorni e orari che scegli, con supporto per più fasce al giorno — es. `8-12,13-20` per la pausa pranzo (default lun–ven 8:00–20:00, con fuso orario esplicito — funziona anche se il server è in UTC)
- 🔁 **Cooldown**: una doppia suonata non apre due volte
- 🔑 **Rotazione automatica del token**: ti autentichi una volta sola
- 📝 **Logging dettagliato** con livelli `info`/`debug`, heartbeat orario, avvisi per dispositivo offline e batteria bassa
- 🐳 **Pronto per Docker** — gira su NAS (Synology/QNAP), VPS, Raspberry Pi o VM cloud gratuite
- 🪶 **Minuscolo**: un file, due dipendenze, ~100 MB di RAM

## Cosa serve

- Un [Ring Intercom](https://www.amazon.it/s?k=ring+intercom) (~60 €, basta la versione audio) installato sul citofono esistente
- Un posto dove far girare il servizio 24/7:
  - il NAS o un Raspberry Pi che hai già
  - una VM gratuita [Oracle Cloud Always Free](https://www.oracle.com/cloud/free/) (quella che uso io — gratis per sempre davvero)
  - un piccolo VPS: [Hetzner Cloud](https://www.hetzner.com/cloud) (~4 €/mese) o [DigitalOcean](https://www.digitalocean.com)

## Avvio rapido

Servono Node.js 20+ e un Ring Intercom già configurato nell'app Ring.

```sh
git clone https://github.com/mzat-dev/ring-intercom-auto-unlock.git
cd ring-intercom-auto-unlock
npm install

# 1. Ottieni il refresh token Ring (chiede email, password e codice 2FA)
npx ring-auth-cli

# 2. Configura
cp .env.example .env
#    incolla il token in RING_REFRESH_TOKEN=...

# 3. Avvia
npm start
```

Suona il citofono: nel log compare il `DING` e pochi secondi dopo l'apertura.

## Deploy con Docker (consigliato)

```sh
docker compose up -d --build
docker compose logs -f
```

> **Importante:** il file `.env` è montato come volume **scrivibile**: Ring ruota periodicamente il refresh token e il servizio salva lì quello nuovo. Non rifare il deploy partendo da una copia vecchia del `.env`.

## Configurazione

Vedi la tabella completa nel [README inglese](README.md#configuration). Le variabili principali: `MIN/MAX_DELAY_SECONDS` (ritardo), `ACTIVE_DAYS` + `ACTIVE_HOURS` + `TIMEZONE` (fasce orarie, es. `8-12,13-20`), `COOLDOWN_SECONDS`, `LOG_LEVEL`.

## Attenzione

Durante la fascia attiva la porta si apre per **chiunque** suoni, senza conferma. Usa la fascia oraria per limitare l'esposizione e valuta se è accettabile per il tuo contesto.

## Sostieni il progetto

- ⭐ Metti una stella alla repo
- ☕ [Offrimi un caffè](https://buymeacoffee.com/mzat.dev)

## Disclaimer

Progetto **non ufficiale**, non affiliato a Ring LLC o Amazon. Si basa sull'API non ufficiale di Ring tramite [ring-client-api](https://github.com/dgreif/ring), che potrebbe cambiare in qualsiasi momento. L'apertura automatica è **a tuo rischio**.

## Licenza

[MIT](LICENSE)
