'use strict'

const Alert = require('./alert')
const crypto = require('crypto')
const shortHash = (str) => {
  let hash = crypto.createHash('sha512').update(str).digest('hex')
  return hash.substr(parseInt(hash.substr(0, 1), 16), 16)
}

class Group {
  constructor (main, config, prevAlerts) {
    this.main = main
    this.config = config
    this.alerts = {}
    this.prevAlerts = prevAlerts || []
  }
  name (name) {
    this.name = name
    this.id = shortHash(name)
    return this
  }
  attachAlert (alert) {
    this.alerts[alert.id] = alert
  }
  alert (id) {
    const alert = new Alert(this.config).setID(id)
    this.attachAlert(alert)
    return alert
  }
  setAutoClear (v) {
    this.autoClear = v
  }
  process () {
    let alerts = Object.keys(this.alerts).map(k => this.alerts[k])
    let prevAlerts = this.prevAlerts
    let clearable = prevAlerts.filter(pa => !alerts.filter(a => a.id === pa.id).length)
    let newPrevAlerts = alerts.filter(a => a.type !== 'clear') // don't keep clear events arround
    let sendNotify = alerts.filter(a => {
      if (!prevAlerts.filter(pa => pa.id === a.id && pa.type === a.type).length && a.type !== 'clear') { // new non-clear
        return true
      }

      if (prevAlerts.filter(pa => pa.id === a.id).length && a.type === 'clear') { // old clear
        return true
      }

      return false
    })
    if (this.autoClear) { // clear clearable events
      sendNotify = sendNotify.concat(clearable.map(a =>
        this.alert(a.id).type('clear').title('Cleared alert ' + JSON.stringify(a.title)).body('Alert for group ' + JSON.stringify(this.name) + ' has been cleared')
      ))
    } else {
      newPrevAlerts = newPrevAlerts.concat(clearable) // keep clearable events arround
    }

    sendNotify.forEach(alert => {
      this.main.notifies.forEach(notify => {
        notify.notify(alert)
      })
    })

    return newPrevAlerts
  }
}

module.exports = Group
