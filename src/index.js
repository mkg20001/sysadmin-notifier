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
    this.notify = []
    this.sources = []
    for (const p in config) { // eslint-disable-line guard-for-in
      switch (true) {
        case p === 'global':
          break
        case p.startsWith('notify.'): {
          let name = p.split('.')[1]
          if (!Notifies[name]) {
            throw new TypeError('Unknown notification system ' + name)
          }
          const Notify = Notifies[name]
          this.notify.push(new Notify(this, Object.assign(globalConf, config[p])))
          break
        }
        case p.startsWith('source.'): {
          let name = p.split('.')[1]
          if (!Sources[name]) {
            throw new TypeError('Unknown source ' + name)
          }
          const Source = Sources[name]
          this.sources.push(new Source(this, Object.assign(globalConf, config[p])))
          break
        }
        default: throw new TypeError('Unknown config option ' + p)
      }
    }
  }
  async init () {
    await Promise.all(this.sources.map(s => s.init()))
  }
  async start () {
    await Promise.all(this.sources.map(s => s.start()))
  }
  async stop () {
    await Promise.all(this.sources.map(s => s.stop()))
  }
}

module.exports = SysadminNotifier
