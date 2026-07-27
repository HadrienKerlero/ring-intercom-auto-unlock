# ring-intercom-auto-unlock

> Ouvre automatiquement votre porte ou portail quand quelqu'un sonne à votre **Ring Intercom** — un service Node.js léger et auto-hébergé. **Pas besoin de Home Assistant ni de Homebridge.**

🌍 [English](README.md) · [Italiano](README.it.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Nederlands](README.nl.md)

Parfait pour les boutiques, bureaux, chambres d'hôtes et tous ceux qui veulent que la porte s'ouvre toute seule pendant les heures d'ouverture — sans décrocher l'interphone à chaque fois.

## Fonctionnalités

- 🔔 **Écoute les sonneries** en temps réel via les notifications push Ring
- ⏱️ **Délai aléatoire** avant l'ouverture (5–20 s par défaut), pour un effet naturel
- 📅 **Plage horaire** : actif uniquement les jours et heures choisis, avec prise en charge de plusieurs plages par jour — ex. `8-12,13-20` pour la pause déjeuner (par défaut lun–ven, 8h–20h, fuseau horaire explicite — fonctionne même sur un serveur en UTC)
- 🔁 **Temporisation** : une double sonnerie n'ouvre pas deux fois
- 🔑 **Rotation automatique du token** — authentifiez-vous une seule fois
- 📝 **Logs détaillés** (`info`/`debug`), heartbeat horaire, alertes hors-ligne et batterie faible
- 🐳 **Prêt pour Docker** — tourne sur NAS (Synology/QNAP), VPS, Raspberry Pi ou VM cloud gratuite
- 🪶 **Minuscule** : un fichier, deux dépendances, ~100 Mo de RAM

## Ce qu'il vous faut

- Un [Ring Intercom](https://www.amazon.fr/s?k=ring+intercom) (~60 €, la version audio suffit)
- Un endroit où faire tourner le service 24h/24 : votre NAS ou Raspberry Pi, une VM gratuite [Oracle Cloud Always Free](https://www.oracle.com/cloud/free/), ou un petit VPS chez [Hetzner Cloud](https://www.hetzner.com/cloud) (~4 €/mois)

## Démarrage rapide

Nécessite Node.js 20+ et un Ring Intercom déjà configuré dans l'app Ring.

```sh
git clone https://github.com/mzat-dev/ring-intercom-auto-unlock.git
cd ring-intercom-auto-unlock
npm install

# 1. Obtenir le refresh token Ring (demande e-mail, mot de passe et code 2FA)
npx ring-auth-cli

# 2. Configurer
cp .env.example .env
#    coller le token dans RING_REFRESH_TOKEN=...

# 3. Lancer
npm start
```

## Déploiement avec Docker (recommandé)

```sh
docker compose up -d --build
docker compose logs -f
```

> **Important :** le fichier `.env` est monté comme volume **accessible en écriture** : Ring fait tourner le refresh token régulièrement et le service y enregistre le nouveau. Ne redéployez jamais depuis une vieille copie du `.env`.

## Configuration

Le tableau complet se trouve dans le [README anglais](README.md#configuration). Variables principales : `MIN/MAX_DELAY_SECONDS` (délai), `ACTIVE_DAYS` + `ACTIVE_HOURS` + `TIMEZONE` (plages horaires, ex. `8-12,13-20`), `COOLDOWN_SECONDS`, `LOG_LEVEL`.

## Attention

Pendant la plage active, la porte s'ouvre pour **quiconque** sonne, sans confirmation. Gardez la plage horaire aussi étroite que possible et vérifiez que c'est acceptable pour votre usage.

## Avertissement

Projet **non officiel**, sans lien avec Ring LLC ou Amazon. Repose sur l'API non officielle de Ring via [ring-client-api](https://github.com/dgreif/ring), qui peut changer à tout moment. L'ouverture automatique se fait **à vos risques et périls**.

## Licence

[MIT](LICENSE)
