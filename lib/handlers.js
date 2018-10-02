const handlers = {
  users(data, callback) {

  },
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

module.exports = handlers