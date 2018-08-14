#!/usr/bin/env node

'use strict'

/* eslint-disable no-console */

const yaml = require('js-yaml')
const fs = require('fs')
const Notifier = require('.')

const conf = yaml.safeLoad(String(fs.readFileSync(process.argv[2])))

const notifier = new Notifier(conf)
async function main () {
  await notifier.init()
  await notifier.start()
}
main().catch(err => {
  console.error(err.stack)
  process.exit(1)
})
