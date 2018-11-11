const environments = {
  staging: {
    httpPort: 3000,
    httpsPort: 3001,
    envName: 'staging',
    hashingSecret: 'topSecret',
  },
  production: {
    httpPort: 80,
    httpsPort: 443,
    envName: 'production',
    hashingSecret: 'topSecret',
  },
}

module.exports = environments[(process.env.NODE_ENV || 'staging').toLowerCase()]