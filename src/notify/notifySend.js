'use strict'

const Notify = require('../notify')
const cp = require('child_process')

const typeIcon = {
  critical: 'dialog-error',
  warning: 'dialog-warning',
  clear: 'flag-green'
}

class NotifySend extends Notify {
  notify (alert) {
    cp.spawn('notify-send', [alert.title, alert.body, '--icon', typeIcon[alert.type]])
  }
}

module.exports = NotifySend
