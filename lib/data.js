const fs = require('fs')
const path = require('path')

const lib = {
  baseDir: path.join(__dirname, '../.data'),
  getFullPath(dir, file) {
    return `${lib.baseDir}/${dir}/${file}.json`
  },
  create(dir, file, data, callback) {
    fs.open(lib.getFullPath(dir, file), 'wx', (err, fileDescriptor) => {
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
    fs.readFile(lib.getFullPath(dir, file), 'utf-8', (err, data) => {
      callback(err, data)
    })
  },
  update(dir, file, data, callback) {
    fs.open(lib.getFullPath(dir, file), 'r+', (err, fileDescriptor) => {
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
    fs.unlink(lib.getFullPath(dir, file, err => {
      if (!err) {
        callback(false)
      } else {
        callback('Error deleting file')
      }
    }))
  },
}

module.exports = lib