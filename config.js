const environments = {
  staging: {
    httpPort: 3000,
    httpsPort: 3001,
    envName: 'staging',
  },
  production: {
    httpPort: 80,
    httpsPort: 443,
    envName: 'production',
  },
}

module.exports = environments[(process.env.NODE_ENV || 'staging').toLowerCase()]