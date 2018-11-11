const fs = require('fs')
const path = require('path')
const config = require('../config')
const helpers = require('./helpers')

const _data = {
  baseDir: path.join(__dirname, '../.data'),
  getFullPath(dir, file) {
    return `${_data.baseDir}/${dir}/${file}.json`
  },
  create(dir, file, data, callback) {
    fs.open(_data.getFullPath(dir, file), 'wx', (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        fs.writeFile(fileDescriptor, JSON.stringify(data), err => {
          if (!err) {
            fs.close(fileDescriptor, err => {
              if (!err) {
                callback(false)
              } else {
                callback('Error closing new file')
                console.log(err)
              }
            })
          } else {
            callback('Error writing to new file')
            console.log(err)
          }
        })
      } else {
        callback('Could not create new file, it may already exist')
        console.log(err)
      }
    })
  },
  read(dir, file, callback) {
    fs.readFile(_data.getFullPath(dir, file), 'utf-8', (err, data) => {
      if (!err && data) {
        callback(false, helpers.parseJsonToObject(data))
      } else {
        callback(err, data)
      }
    })
  },
  update(dir, file, data, callback) {
    fs.open(_data.getFullPath(dir, file), 'r+', (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        fs.truncate(fileDescriptor, err => {
          if (!err) {
            fs.writeFile(fileDescriptor, JSON.stringify(data), err => {
              if (!err) {
                fs.close(fileDescriptor, err => {
                  if (!err) {
                    callback(false)
                  } else {
                    callback('Error closing file')
                    console.log(err)
                  }
                })
              } else {
                callback('Error writing to existing file')
                console.log(err)
              }
            })
          } else {
            callback('Error truncating existing file')
            console.log(err)
          }
        })
      } else {
        callback('Could not open the file for updating, it may not exist yet')
        console.log(err)
      }
    })
  },
  delete(dir, file, callback) {
    fs.unlink(_data.getFullPath(dir, file, err => {
      if (!err) {
        callback(false)
      } else {
        callback('Error deleting file')
      }
    }))
  },
}

module.exports = _data