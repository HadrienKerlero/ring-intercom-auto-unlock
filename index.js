/**
 * ring-intercom-auto-unlock
 *
 * Automatically unlocks your door or gate when someone rings your Ring
 * Intercom, after a random human-like delay and only within a configurable
 * schedule (days, hours, timezone).
 *
 * Author:  Mattia Zatelli <zatellimattia@gmail.com>
 * License: MIT — https://github.com/mzat-dev/ring-intercom-auto-unlock
 *
 * Unofficial project, not affiliated with Ring LLC or Amazon.
 */

import 'dotenv/config'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { RingApi } from 'ring-client-api'

const ENV_PATH = join(dirname(fileURLToPath(import.meta.url)), '.env')

const MIN_DELAY = Number(process.env.MIN_DELAY_SECONDS ?? 5)
const MAX_DELAY = Number(process.env.MAX_DELAY_SECONDS ?? 20)
// window after an unlock during which new dings are ignored,
// so the gate doesn't open again if the visitor rings twice
const COOLDOWN = Number(process.env.COOLDOWN_SECONDS ?? 60)

// auto-unlock is only active on these days/hours
const TIMEZONE = process.env.TIMEZONE ?? 'Europe/Rome'
// one or more hour ranges, e.g. "8-20" or "8-12,13-20" (start inclusive, end exclusive);
// START_HOUR/END_HOUR are still honored as a fallback for older configs
const ACTIVE_HOURS = (
  process.env.ACTIVE_HOURS ??
  `${process.env.START_HOUR ?? 8}-${process.env.END_HOUR ?? 20}`
)
  .split(',')
  .map((range) => {
    const [start, end] = range.split('-').map(Number)
    return { start, end }
  })
// 1=Monday ... 7=Sunday
const ACTIVE_DAYS = (process.env.ACTIVE_DAYS ?? '1,2,3,4,5').split(',').map(Number)

if (ACTIVE_HOURS.some(({ start, end }) => !Number.isInteger(start) || !Number.isInteger(end) || start >= end)) {
  console.error(`Invalid ACTIVE_HOURS: "${process.env.ACTIVE_HOURS}". Expected e.g. "8-20" or "8-12,13-20"`)
  process.exit(1)
}

// info (default) | debug — debug also enables ring-client-api internal logs
const LOG_LEVEL = process.env.LOG_LEVEL ?? 'info'
// how often (minutes) to log that the service is alive (0 = disabled)
const HEARTBEAT_MINUTES = Number(process.env.HEARTBEAT_MINUTES ?? 60)

const WEEKDAYS = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }

function isWithinSchedule(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    weekday: 'short',
    hour: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(date)
  const weekday = WEEKDAYS[parts.find((p) => p.type === 'weekday').value]
  const hour = Number(parts.find((p) => p.type === 'hour').value)
  return (
    ACTIVE_DAYS.includes(weekday) &&
    ACTIVE_HOURS.some(({ start, end }) => hour >= start && hour < end)
  )
}

function formatHours() {
  return ACTIVE_HOURS.map(({ start, end }) => `${start}:00-${end}:00`).join(', ')
}

function localTime(date = new Date()) {
  return date.toLocaleString('en-GB', { timeZone: TIMEZONE })
}

const log = {
  write(level, args) {
    console.log(new Date().toISOString(), `[${level}]`, ...args)
  },
  debug(...args) {
    if (LOG_LEVEL === 'debug') this.write('debug', args)
  },
  info(...args) {
    this.write('info', args)
  },
  warn(...args) {
    this.write('warn', args)
  },
  error(...args) {
    this.write('error', args)
  },
}

if (!process.env.RING_REFRESH_TOKEN) {
  log.error(
    'RING_REFRESH_TOKEN is missing. Run "npx ring-auth-cli" to get a token,',
    'then save it in the .env file as RING_REFRESH_TOKEN=<token>',
  )
  process.exit(1)
}

log.info('Starting auto-unlock service')
log.info(`  node ${process.version}, log level: ${LOG_LEVEL}`)
log.info(`  unlock delay: ${MIN_DELAY}-${MAX_DELAY}s, cooldown: ${COOLDOWN}s`)
log.info(
  `  active window: days [${ACTIVE_DAYS.join(',')}] (1=Mon...7=Sun), ` +
    `hours ${formatHours()} (${TIMEZONE})`,
)
log.info(`  local time is ${localTime()} — window is ${isWithinSchedule() ? 'ACTIVE' : 'NOT active'}`)

const ringApi = new RingApi({
  refreshToken: process.env.RING_REFRESH_TOKEN,
  controlCenterDisplayName: 'ring-intercom-auto-unlock',
  debug: LOG_LEVEL === 'debug',
})

// Ring rotates refresh tokens: without persistence the service could not
// authenticate again after the next restart
ringApi.onRefreshTokenUpdated.subscribe(async ({ newRefreshToken, oldRefreshToken }) => {
  log.info('Refresh token rotated by Ring, saving the new token to .env')
  try {
    const env = await readFile(ENV_PATH, 'utf8')
    const updated = oldRefreshToken && env.includes(oldRefreshToken)
      ? env.replace(oldRefreshToken, newRefreshToken)
      : env.replace(/^RING_REFRESH_TOKEN=.*$/m, `RING_REFRESH_TOKEN=${newRefreshToken}`)
    await writeFile(ENV_PATH, updated)
    log.debug('New refresh token saved successfully')
  } catch (e) {
    log.error('Could not save the new refresh token:', e.message)
  }
})

log.debug('Connecting to Ring locations...')
const locations = await ringApi.getLocations()
log.info(`Locations found: ${locations.map((l) => `"${l.name}"`).join(', ')}`)

const intercoms = locations.flatMap((location) => location.intercoms)

if (intercoms.length === 0) {
  log.error('No Ring Intercom found on this account.')
  process.exit(1)
}

for (const intercom of intercoms) {
  log.info(
    `Intercom found: "${intercom.name}" (id ${intercom.id}, type ${intercom.deviceType}, ` +
      `battery ${intercom.batteryLevel}%${intercom.isOffline ? ', OFFLINE' : ''})`,
  )

  // track device state changes (battery, connectivity)
  let lastBattery = intercom.batteryLevel
  let lastOffline = intercom.isOffline
  intercom.onData.subscribe(() => {
    if (intercom.isOffline !== lastOffline) {
      lastOffline = intercom.isOffline
      if (intercom.isOffline) {
        log.warn(`"${intercom.name}" is OFFLINE`)
      } else {
        log.info(`"${intercom.name}" is back online`)
      }
    }
    if (intercom.batteryLevel !== lastBattery) {
      log.debug(`"${intercom.name}" battery: ${lastBattery}% -> ${intercom.batteryLevel}%`)
      lastBattery = intercom.batteryLevel
      if (intercom.batteryLevel !== null && intercom.batteryLevel <= 20) {
        log.warn(`"${intercom.name}" battery low: ${intercom.batteryLevel}%`)
      }
    }
  })

  let busyUntil = 0

  intercom.onDing.subscribe(() => {
    log.info(`DING received from "${intercom.name}" (at ${localTime()})`)

    if (!isWithinSchedule()) {
      log.info('  -> ignored: outside the auto-unlock time window')
      return
    }
    const now = Date.now()
    if (now < busyUntil) {
      const secondsLeft = Math.ceil((busyUntil - now) / 1000)
      log.info(`  -> ignored: unlock already in progress or cooling down (${secondsLeft}s left)`)
      return
    }

    const delaySeconds = MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY)
    busyUntil = now + (delaySeconds + COOLDOWN) * 1000
    const openAt = new Date(now + delaySeconds * 1000)
    log.info(
      `  -> unlock scheduled in ${delaySeconds.toFixed(1)}s (at ${localTime(openAt)})`,
    )

    setTimeout(async () => {
      if (!isWithinSchedule()) {
        busyUntil = 0
        log.warn(`Unlock cancelled ("${intercom.name}"): closing time reached`)
        return
      }
      log.info(`Sending unlock command to "${intercom.name}"...`)
      const started = Date.now()
      try {
        await intercom.unlock()
        log.info(`GATE OPENED ("${intercom.name}", command succeeded in ${Date.now() - started}ms)`)
        log.debug(`  cooldown active for another ${COOLDOWN}s`)
      } catch (e) {
        busyUntil = 0
        log.error(`Failed to unlock ("${intercom.name}"):`, e.message)
        log.debug(e.stack)
      }
    }, delaySeconds * 1000)
  })

  intercom.onUnlocked.subscribe(() => {
    log.info(`Unlock confirmation received from "${intercom.name}"`)
  })

  intercom.onRequestUpdate.subscribe(() => {
    log.debug(`Data update requested for "${intercom.name}"`)
  })
}

if (HEARTBEAT_MINUTES > 0) {
  setInterval(() => {
    const status = intercoms
      .map(
        (i) =>
          `"${i.name}": ${i.isOffline ? 'OFFLINE' : 'online'}, battery ${i.batteryLevel}%`,
      )
      .join('; ')
    log.info(`Heartbeat — service alive, window ${isWithinSchedule() ? 'ACTIVE' : 'not active'} (${status})`)
  }, HEARTBEAT_MINUTES * 60 * 1000)
}

log.info('Listening for dings...')

function shutdown(signal) {
  log.info(`Received ${signal}, shutting down`)
  ringApi.disconnect()
  process.exit(0)
}
process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

process.on('unhandledRejection', (reason) => {
  log.error('Unhandled rejection:', reason?.message ?? reason)
  log.debug(reason?.stack)
})
