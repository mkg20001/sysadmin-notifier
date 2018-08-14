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
    return this.config.hosts.map(host => this.checkHost(host))
  }
  async checkHost (host) {
    const g = this.main.group('netdata host ' + host)
    try {
      let res = await fetch('http://' + host + ':19999/api/v1/alarms?active')
      res = await res.json()
      console.log(res)
    } catch (e) {
      g.alert('fetch_error').critical().title('Could not fetch netdata alerts for ' + host).body('Please check network connectivity and host uptime').since(Date.now())
    }
  }
}

module.exports = Netdata
