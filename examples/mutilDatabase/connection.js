const mongoose = require('mongoose')
mongoose.Promise = Promise

const log = console.log
const connectDB = (url, options = {}) => {
  const db = mongoose.createConnection(url, options)
  db.on('error', err => {
    err.message = `[mongoose]${err.message}`
    log('error', err)
  })

  db.on('disconnected', () => {
    log('error', `[mongoose] ${url} disconnected`)
  })

  db.on('connected', () => {
    log('info', `[mongoose] ${url} connected successfully`)
  })

  db.on('reconnected', () => {
    log('info', `[mongoose] ${url} reconnected successfully`)
  })

  return db
}
const dbCfg = [{
  name: 'irajs-etl',
  url: 'mongodb://localhost/irajs-etl',
  options: {}
}, {
  name: 'irajs-etl-2',
  url: 'mongodb://localhost/irajs-etl2',
  options: {}
}]

const dbs = new Map()
for (let c of dbCfg) {
  dbs.set(c.name, connectDB(c.url, c.options))
}
exports.dbs = dbs
