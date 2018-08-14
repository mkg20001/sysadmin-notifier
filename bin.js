#!/usr/bin/env node

'use strict'

/* eslint-disable no-console */

const yaml = require('js-yaml')
const fs = require('fs')
const Notifier = require('.')
const ConsoleNotify = require('./src/notify/console')
const consoleNotify = new ConsoleNotify()

const conf = yaml.safeLoad(String(fs.readFileSync(process.argv[2])))

const notifier = new Notifier(conf)
let started = false

async function main () {
  console.log('Starting...'.bold)
  await notifier.init()
  await notifier.start()
  started = true
  console.log()
}

process.stdin.on('data', () => {
  if (!started) {
    return
  }
  console.log()
  notifier.sources.map(s => s.prevGroups).reduce((a, b) => a.concat(b || []), [])
    .forEach(group => {
      const alerts = notifier.prevAlerts[group.id]

      if (alerts.length) {
        console.log('Active alerts for group %s (%s):'.bold, group.name, alerts.length)
        alerts.forEach(alert => consoleNotify.notify(alert))
        console.log()
      }
    })
})

main().catch(err => {
  console.error(err.stack)
  process.exit(1)
})
