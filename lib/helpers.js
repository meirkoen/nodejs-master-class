const crypto = require('crypto')

const helpers = {
  hash(str) {
    if (typeof str === 'string' && str.length) {
      return crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex')
    } else {
      return false
    }
  }
}

module.exports = helpers