const config = require('../config')
const _data = require('./data')
const helpers = require('./helpers')

const handlers = {
  users(data, callback) {
    const acceptableMethods = [
      'GET',
      'POST',
      'PUT',
      'DELETE',
    ]

    if (acceptableMethods.indexOf(data.method) > -1) {
      handlers._users[data.method](data, callback)
    } else {
      callback(405)
    }
  },
  _users: {
    GET(data, callback) {

    },
    POST(data, callback) {
      let firstName = typeof data.payload.firstName === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false
      let lastName = typeof data.payload.lastName === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false
      let phone = typeof data.payload.phone === 'string' && data.payload.phone.trim().length >= 7 ? data.payload.phone.trim() : false
      let password = typeof data.payload.password === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false
      let tosAgreement = typeof data.payload.tosAgreement === 'boolean' && data.payload.tosAgreement || false

      if (firstName, lastName, phone, password, tosAgreement) {
        _data.read('users', phone, (err, data) => {
          if (err) {
            const hashedPassword = helpers.hash(password)

            if (hashedPassword) {
              const userObject = { firstName, lastName, phone, hashedPassword, tosAgreement }

              _data.create('users', phone, userObject, err => {
                if (!err) {
                  callback(200)
                } else {
                  console.log(err)
                  callback(500, {
                    Error: 'Could not create the new user'
                  })
                }
              })
            } else {
              callback(500, {
                Error: 'Could not hash the user\'s password'
              })
            }

          } else {
            callback(400, {
              Error: 'A user with that phone number already exists'
            })
          }
        })
      } else {
        callback(400, {
          Error: 'Missing Required fields'
        })
      }

    },
    PUT(data, callback) {

    },
    DELETE(data, callback) {

    },
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