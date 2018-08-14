'use strict'

const Group = require('./group')

class Source {
  constructor (main, config) {
    this.main = main
    this.config = config
    this.intv = 0
  }
  async doCheck () {
    const groups = await this.check()
    groups.forEach(g => {
      this.main.prevAlerts[g.id] = g.process()
    })
    this.prevGroups = groups
  }
  async start () {
    await this.doCheck()
    this.intv = setInterval(() => this.doCheck(), this.config.interval)
  }
  async stop () {
    clearInterval(this.intv)
  }
  group (name) {
    const g = new Group(this.main, this.config).name(name)
    g.prevAlerts = this.main.prevAlerts[g.id] || []
    return g
  }
}

module.exports = Source
