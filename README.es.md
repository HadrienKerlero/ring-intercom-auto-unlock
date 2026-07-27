# ring-intercom-auto-unlock

> Abre automáticamente tu puerta o portal cuando alguien llama a tu **Ring Intercom** — un servicio Node.js ligero y autoalojado. **Sin Home Assistant ni Homebridge.**

🌍 [English](README.md) · [Italiano](README.it.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Nederlands](README.nl.md)

Perfecto para tiendas, oficinas, alojamientos turísticos y cualquiera que quiera que la puerta se abra sola en horario de apertura — sin contestar al telefonillo cada vez.

## Características

- 🔔 **Escucha los timbrazos** en tiempo real mediante notificaciones push de Ring
- ⏱️ **Retardo aleatorio** antes de abrir (5–20 s por defecto), para que parezca que alguien contestó
- 📅 **Horario**: activo solo los días y horas que elijas, con soporte para varias franjas al día — p. ej. `8-12,13-20` para la pausa de comida (por defecto lun–vie, 8:00–20:00, con zona horaria explícita — funciona aunque el servidor esté en UTC)
- 🔁 **Enfriamiento**: un doble timbrazo no abre dos veces
- 🔑 **Rotación automática del token** — autentícate una sola vez
- 📝 **Registro detallado** (`info`/`debug`), heartbeat cada hora, avisos de dispositivo sin conexión y batería baja
- 🐳 **Listo para Docker** — funciona en NAS (Synology/QNAP), VPS, Raspberry Pi o VM gratuita en la nube
- 🪶 **Diminuto**: un archivo, dos dependencias, ~100 MB de RAM

## Qué necesitas

- Un [Ring Intercom](https://www.amazon.es/s?k=ring+intercom) (~60 €, la versión de audio es suficiente)
- Un sitio donde ejecutar el servicio 24/7: tu NAS o Raspberry Pi, una VM gratuita [Oracle Cloud Always Free](https://www.oracle.com/cloud/free/), o un pequeño VPS en [Hetzner Cloud](https://www.hetzner.com/cloud) (~4 €/mes)

## Inicio rápido

Requiere Node.js 20+ y un Ring Intercom ya configurado en la app de Ring.

```sh
git clone https://github.com/mzat-dev/ring-intercom-auto-unlock.git
cd ring-intercom-auto-unlock
npm install

# 1. Obtén el refresh token de Ring (pide email, contraseña y código 2FA)
npx ring-auth-cli

# 2. Configura
cp .env.example .env
#    pega el token en RING_REFRESH_TOKEN=...

# 3. Ejecuta
npm start
```

## Despliegue con Docker (recomendado)

```sh
docker compose up -d --build
docker compose logs -f
```

> **Importante:** el archivo `.env` se monta como volumen **con escritura**: Ring rota el refresh token periódicamente y el servicio guarda ahí el nuevo. No vuelvas a desplegar desde una copia antigua del `.env`.

## Configuración

La tabla completa está en el [README en inglés](README.md#configuration). Variables principales: `MIN/MAX_DELAY_SECONDS` (retardo), `ACTIVE_DAYS` + `ACTIVE_HOURS` + `TIMEZONE` (franjas horarias, p. ej. `8-12,13-20`), `COOLDOWN_SECONDS`, `LOG_LEVEL`.

## Atención

Durante el horario activo la puerta se abre para **cualquiera** que llame, sin confirmación. Mantén la franja horaria lo más estrecha posible y valora si es aceptable en tu caso.

## Aviso legal

Proyecto **no oficial**, sin relación con Ring LLC ni Amazon. Se basa en la API no oficial de Ring mediante [ring-client-api](https://github.com/dgreif/ring), que puede cambiar en cualquier momento. La apertura automática es **bajo tu propia responsabilidad**.

## Licencia

[MIT](LICENSE)
