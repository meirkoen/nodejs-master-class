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
      const phone = typeof data.query.phone === 'string' && data.query.phone.trim().length >= 7 ? data.query.phone.trim() : false

      if (phone) {
        _data.read('users', phone, (err, data) => {
          if (!err && data) {
            delete data.hashedPassword
            callback(200, data)
          } else {
            callback(404)
          }
        })
      } else {
        callback(400, {
          Error: 'Missing required field'
        })
      }
    },
    POST(data, callback) {
      const firstName = typeof data.payload.firstName === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false
      const lastName = typeof data.payload.lastName === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false
      const phone = typeof data.payload.phone === 'string' && data.payload.phone.trim().length >= 7 ? data.payload.phone.trim() : false
      const password = typeof data.payload.password === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false
      const tosAgreement = typeof data.payload.tosAgreement === 'boolean' && data.payload.tosAgreement || false

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
          Error: 'Missing Required field'
        })
      }

    },
    PUT(data, callback) {
      const phone = typeof data.payload.phone === 'string' && data.payload.phone.trim().length >= 7 ? data.payload.phone.trim(): false

      if (phone) {
        const firstName = typeof data.payload.firstName === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false
        const lastName = typeof data.payload.lastName === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false
        const password = typeof data.payload.password === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false

        if (firstName || lastName || password) {
          _data.read('users', phone, (err, userData) => {
            if (!err) {
              if (firstName) {
                userData.firstName = firstName
              }
              if (lastName) {
                userData.lastName = lastName
              }
              if (password) {
                userData.hashedPassword = helpers.hash(password)
              }

              _data.update('users', phone, userData, err => {
                if (!err) {
                  callback(200)
                } else {
                  console.log(err)
                  callback(500, {
                    Error: 'Could not update the user'
                  })
                }
              })
            } else {
              callback(404)
            }
          })
        } else {
          callback(400, 'Missing fields to update')
        }
      } else {
        callback(400, {
          Error: 'Missing required field'
        })
      }
    },
    DELETE(data, callback) {
      const phone = typeof data.query.phone === 'string' && data.query.phone.trim().length >= 7 ? data.query.phone.trim() : false

      if (phone) {
        _data.delete('users', phone, err => {
          if (!err) {
            callback(200)
          } else {
            callback(500, {
              Error: 'Could not delete the specified user'
            })
          }
        })
      } else {
        callback(400, {
          Error: 'Missing required field'
        })
      }
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