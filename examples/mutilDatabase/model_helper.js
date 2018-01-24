'use strict'

const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const _ = require('lodash')
const defaultDB = 'irajs-etl'

const connection = require('./connection')

exports.build = ({name = '', db = defaultDB, attributes = {}, statics = {}, methods = {}, index = {}, setSchema = (s) => {}}) => {
  // const obj = Object.assign({}, attributes)
  copyComment2Description(attributes)
  const schema = new mongoose.Schema(attributes)
  schema.set('timestamps', true) // createAt, updatedAt -> UTC
  schema.set('minimize', false) // Mongoose will, by default, "minimize" schemas by removing
  // empty objects
  schema.set('collection', name)
  schema.set('strict', false)
  schema.set('id', true)
  schema.set('toObject', {getters: true, virtuals: true, minimize: false, id: true})
  schema.set('toJSON', {getters: true, virtuals: true, minimize: false, id: true})

  Object.assign(schema.statics, statics)
  Object.assign(schema.methods, methods)

  schema.plugin(mongoosePaginate)

  // 用于创建一些特殊的索引，例如 a.b
  if (!_.isEmpty(index)) {
    schema.index(index)
  }
  setSchema(schema)

  const dbConnection = connection.dbs.get(db)
  const model = dbConnection.model(name, schema)
  model.ObjectId = mongoose.Types.ObjectId

  return model
}

function copyComment2Description (val) {
  if (isObject(val)) {
    if (val.comment && typeof val.comment === 'string' && !val.description) {
      val.description = val.comment
    }
    for (let j in val) {
      if (isObject(val[j])) {
        copyComment2Description(val[j])
      }
    }
  }
}

function isObject (val) {
  return _.isObject(val) && !_.isFunction(val)
}
