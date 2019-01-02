const config = require('../config')
const crypto = require('crypto')

const helpers = {
  hash(str) {
    if (typeof str === 'string' && str.length) {
      return crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex')
    } else {
      return false
    }
  },
  parseJsonToObject(str) {
    try {
      return JSON.parse(str)
    } catch(e) {
      return {}
    }
  },
  createRandomString(length) {
    length = (typeof length === 'number') && length > 0 ? length : false

    if (length) {
      const passibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWYZabcdefghijklmnopqrstuvwyz0123456789'
      let str = ''

      for (let i = 0; i < length; i++) {
        const randomCharacter = passibleCharacters.charAt(Math.floor(Math.random() * passibleCharacters.length))

        str += randomCharacter
      }

      return str
    } else {
      return false
    }
  },
}

module.exports = helpers