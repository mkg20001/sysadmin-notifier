'use strict'

const fetch = require('node-fetch')
const Source = require('../source')

/*

for every host in hosts:
  g = main.group('netdata ' + host.friendlyName)
  for every alert in host.alerts
    g.alert(alert.id).type(etc)
*/

class Netdata extends Source {
  async init () {

  }
  async check () {
    return Promise.all(this.config.hosts.map(host => this.checkHost(host)))
  }
  async checkHost (host) {
    const g = this.group('netdata host ' + host)
    try {
      g.setAutoClear(true)
      let res = await fetch('http://' + host + ':19999/api/v1/alarms?active')
      res = await res.json()
      for (const alarmID in res.alarms) { // eslint-disable-line guard-for-in
        const alarm = res.alarams[alarmID]
        console.log(alarm)
      }
    } catch (e) {
      g.alert('fetch_error').critical().title('Could not fetch netdata alerts for ' + host).body('Please check network connectivity and host uptime').since(Date.now())
    }
    return g
  }
}

module.exports = Netdata
