const http = require('http')
const https = require('https')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder
const fs = require('fs')
const config = require('./config')

const decoder = new StringDecoder('utf-8')

const handlers = {
  hello(data, callback) {
    callback(200, 'Welcome!')
  },
  ping(data, callback) {
    callback(200)
  },
  notFound(data, callback) {
    callback(404)
  },
}

const router = {
  hello: handlers.hello,
  ping: handlers.ping,
}

const generalServer = (req, res) => {
  const parsedUrl = url.parse(req.url, true)
  const trimmedPath = parsedUrl.pathname.replace(/^\/+|\/+$/g, '')
  let payload = ''

  req.on('data', data => payload += decoder.write(data))

  req.on('end', () => {
    payload += decoder.end()

    const handler = router[trimmedPath] || handlers.notFound
    const data = {
      trimmedPath,
      query: parsedUrl.query,
      method: req.method.toUpperCase(),
      headers: req.headers,
      payload,
    }

    handler(data, (status, payload) => {
      const statusCode = Number.isInteger(status) && status || 200
      const payloadString = JSON.stringify(payload || {})

      res.setHeader('Content-Type', 'application/json')
      res.writeHead(status)
      res.end(payloadString)

      console.log(`response: ${statusCode}, ${payloadString}`)
    })
  })
}

const httpServer = http.createServer(generalServer)
const httpsServer = https.createServer({
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem'),
}, generalServer)

httpsServer.listen(config.httpsPort, () => console.log(`Listening on port ${config.httpsPort}`))
httpServer.listen(config.httpPort, () => console.log(`Listening on port ${config.httpPort}`))