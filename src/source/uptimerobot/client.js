'use strict'

const fetch = require('node-fetch')
const parseXML = require('xml-parser')

const API = 'https://api.uptimerobot.com'
const RE = /^jsonUptimeRobotApi\((.*)\)$/

function processQS (qs) {
  let out = {}
  for (const p in qs) { // eslint-disable-line guard-for-in
    switch (true) {
      case typeof qs[p] === 'boolean':
        out[p] = qs[p] ? 1 : 0
        break
      case Array.isArray(qs[p]):
        out[p] = qs[p].join('-')
        break
      default:
        out[p] = qs[p]
    }
  }
  return out
}

class UptimeRobotClient {
  constructor (key) {
    this.key = key
  }
  async request (url, opt) {
    let qs = processQS(Object.assign({apiKey: this.key, format: 'json'}, opt))
    url = API + url + '?' + Object.keys(qs).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(qs[key])).join('&')

    let res = await fetch(url)
    res = await res.text()

    let match = res.match(RE)
    if (!match) {
      if (res.startsWith('<error')) { // ex: <error id="101" message="apiKey is wrong"/>
        let err = parseXML(res).root.attributes
        let e = new Error('UptimeRobot Error #' + err.id + ': ' + err.message)
        e.id = err.id
        throw e
      }

      if (res.startsWith('<!DOCTYPE html>')) { // cloudflare error page or something else
        throw new Error('Cloudflare Timeout or other error')
      }

      throw new Error('Malformed response. Please report (base64 encoded): ' + Buffer.from(res).toString('base64')) // no idea what this could be
    }

    let data = JSON.parse(match[1])
    if (data.stat === 'fail') {
      throw new Error(data.message)
    }

    return data
  }
  getMonitors (opt) {
    return this.request('/getMonitors', opt)
  }
}

module.exports = UptimeRobotClient
