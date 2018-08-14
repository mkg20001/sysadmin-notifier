'use strict'

const Notifies = {
  console: require('./notify/console'),
  notifySend: require('./notify/notifySend')
}

const Sources = {
  netdata: require('./source/netdata'),
  uptimerobot: require('./source/uptimerobot')
}

class SysadminNotifier {
  constructor (config) {
    const globalConf = config.global || {}
    for (const p in config) { // eslint-disable-line guard-for-in
      switch (true) {
        case p === 'global':
          break
        case p.startsWith('notify.'): {
          break
        }
        case p.startsWith('source.'): {
          break
        }
        default: throw new TypeError('Unknown config option ' + p)
      }
    }
  }
}

module.exports = SysadminNotifier
