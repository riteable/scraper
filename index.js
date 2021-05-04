const needle = require('needle')
const cheerio = require('cheerio')
const worker = require('@riteable/q-worker')
const helpers = require('./helpers')

class Scraper {
  constructor () {
    this._dataMap = this.helpers
  }

  get helpers () {
    return helpers
  }

  async _request (url) {
    let res

    if (this._q) {
      res = await this._q.add(() => needle('get', url))
    } else {
      res = await needle('get', url)
    }

    const $ = cheerio.load(res.body || '')

    return { ...res, $ }
  }

  async _getData (res) {
    const data = {}

    for (const field in this._dataMap) {
      data[field] = await this._dataMap[field](res)
    }

    return data
  }

  _normalizeLinkUrl (url) {
    if (url.indexOf('/') === 0) {
      return this._indexUrl + url
    }

    if (url.indexOf('http') === 0) {
      return url
    }

    return this._indexUrl + '/' + url
  }

  _getLinks ({ $ }) {
    const selector = this._linkSelector || 'a'

    return $(selector).map((i, el) => el.attribs.href).get()
  }

  async _scrapePages (urls) {
    const data = await Promise.all(urls.map(async (url) => {
      url = this._normalizeLinkUrl(url)

      const res = await this._request(url)

      const data = await this._getData(res)

      return data
    }))

    return data
  }

  async _getIndexResponse () {
    if (!this._indexResponse) {
      if (!this._indexUrl) {
        throw new Error('Index URL not set.')
      }

      this._indexResponse = await this._request(this._indexUrl)
    }

    return this._indexResponse
  }

  setIndexUrl (url) {
    this._indexUrl = url

    return this
  }

  setDataMap (dataMap) {
    this._dataMap = dataMap

    return this
  }

  setLinkSelector (selector) {
    this._linkSelector = selector

    return this
  }

  setThrottle (options = {}) {
    this._q = worker(options)

    return this
  }

  async fetchIndex () {
    const res = await this._getIndexResponse()
    const data = await this._getData(res)

    return data
  }

  async fetchPages () {
    const res = await this._getIndexResponse()
    const links = await this._getLinks(res)

    return this._scrapePages(links)
  }
}

module.exports = Scraper
