'use strict'

const UptimeRobotClient = require('uptimerobot-client')
const assert = require('assert')
const prom = (fnc) => new Promise((resolve, reject) => fnc((err, res) => err ? reject(err) : resolve(res)))
const Source = require('../source')

const stateMap = {
  0: 'paused',
  2: 'up',
  9: 'down'
}

const stateTypeMap = {
  0: 'warning',
  2: 'clear',
  9: 'critical'
}

class UptimeRobot extends Source {
  async init () {
    assert(this.config.apikey, 'Set the uptimerobot apikey!')
    this.client = new UptimeRobotClient(this.config.apikey)
  }
  async check () {
    let res = await await prom(cb => this.client.getMonitors({logs: true}, cb))
    res = res.monitors.monitor.map(r => {
      r[stateMap[r.status]] = true
      r.state = stateMap[r.status]
      r.stateType = stateTypeMap[r.status]
      r.name = r.friendlyname
      r.last_status_change = Date.parse(r.log[0].datetime)
      return r
    })
    let g = this.group('UptimeRobot')
    res.forEach(monitor => {
      let alert = g.alert(monitor.id).type(monitor.stateType)
        .since(monitor.last_status_change)
        .title(monitor.name + (monitor.state === 'up' ? (' up again (' + monitor.alltimeuptimeratio + '%)') : (' is ' + monitor.state)))
      alert.body(monitor.name + ' (' + monitor.url + (monitor.port ? (':' + monitor.port) : '') + ') is ' + monitor.state + ' ' + alert.timeField)
    })
    return [g]
  }
}

module.exports = UptimeRobot
