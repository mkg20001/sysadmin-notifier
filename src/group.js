'use strict'

const Alert = require('./alert')

class Group {
  constructor (main) {
    this.main = main
  }
  name (name) {
    this.name = name
    return this
  }
  alert (id) {
    const alert = new Alert(id)
    this.attachAlert(alert)
  }
}

module.exports = Group
