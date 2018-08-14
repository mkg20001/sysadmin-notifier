'use strict'

/* eslint-disable no-console */

const Notify = require('../notify')

const typeColor = {
  ciritical: 'red',
  warning: 'yellow',
  clear: 'green'
}

class Console extends Notify {
  notify (alert) {
    const color = typeColor[alert.type]
    console.log(`[${alert.timeField ? (alert.timeField.toUpperCase() + '/') : ''}${alert.type.toUpperCase()}] ${alert.title}`[color].bold)
    if (alert.body) {
      alert.body.split('\n').map(s => ('   ' + s)[color]).forEach(console.log)
    }
  }
}

module.exports = Console
