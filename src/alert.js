'use strict'

const moment = require('moment')

class Alert {
  constructor (config) {
    this.config = config
  }
  at (time) {
    this.timeField = moment(time).format('[at] ' + this.config.dateFormat)
    return this
  }
  since (time) {
    this.timeField = moment(time).format('[since] ' + this.config.dateFormat)
    return this
  }

  critical () {
    this.type = 'critical'
    return this
  }
  warn () {
    this.type = 'warning'
    return this
  }
  clear () {
    this.type = 'clear'
    return this
  }
  type (type) {
    this.type = type
    return this
  }

  title (title) {
    this.title = title
    return this
  }
  body (body) {
    this.body = body
    return this
  }
}

module.exporrts = Alert
