'use strict'

const assert = require('assert')
const Source = require('../../source')
const UptimeRobotClient = require('./client')

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
    assert(this.config.apikey, 'Set the UptimeRobot apikey!')
    this.client = new UptimeRobotClient(this.config.apikey)
    this.blacklist = (this.config.blacklist || []).map(i => String(i))
  }
  async check () {
    let res
    try {
      res = await this.client.getMonitors({logs: true})
    } catch (e) {
      let g = this.group('UptimeRobot')
      g.alert('fetch_error').type('critical').at(Date.now()).title('Failed to fetch UptimeRobot monitors').body(e.toString())
      return [g]
    }

    res = res.monitors.monitor.map(r => {
      r[stateMap[r.status]] = true
      r.state = stateMap[r.status]
      r.stateType = stateTypeMap[r.status]
      r.name = r.friendlyname
      r.last_status_change = Date.parse(r.log[0].datetime)
      return r
    }).filter(r => this.blacklist.indexOf(r.id) === -1)
    let g = this.group('UptimeRobot').setAutoClear(true)
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
