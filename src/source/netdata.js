'use strict'

const fetch = require('node-fetch')
const Source = require('../source')

/*

for every host in hosts:
  g = group('netdata ' + host.friendlyName)
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
      let res = await Promise.race([
        fetch('http://' + host + ':19999/api/v1/alarms?active'),
        new Promise((resolve, reject) => setTimeout(() => reject(new Error('Timeout')), this.config.timeout || 10 * 1000))
      ])
      res = await res.json()
      for (const alarmID in res.alarms) { // eslint-disable-line guard-for-in
        const alarm = res.alarms[alarmID]
        const alert = g.alert(alarm.id).type(alarm.status.toLowerCase())
        let title
        let body
        switch (alarm.status) {
          case 'CRITICAL':
            title = alarm.name.replace(/_/g, ' ') + ' = ' + alarm.value_string
            body = alarm.hostname + ' - ' + alarm.chart + ' (' + alarm.family + ')\nescalated to critical: ' + alarm.info
            break
          case 'WARNING':
            title = alarm.name.replace(/_/g, ' ') + ' = ' + alarm.value_string
            body = alarm.hostname + ' - ' + alarm.chart + ' (' + alarm.family + ')\nwarning: ' + alarm.info
            break
          case 'CLEAR':
            title = alarm.name.replace(/_/g, ' ') + ' back to normal (' + alarm.value_string + ')'
            body = alarm.hostname + ' - ' + alarm.chart + ' (' + alarm.family + ')\nclear: ' + alarm.info
            break
          default: throw new TypeError('Unknown alert type ' + alarm.status)
        }
        alert.title(title).body(body)
      }
    } catch (e) {
      g.alert('fetch_error').critical().title('Could not fetch netdata alerts for ' + host).body(e.toString() + '\nPlease check network connectivity and host uptime').since(Date.now())
    }
    return g
  }
}

module.exports = Netdata
