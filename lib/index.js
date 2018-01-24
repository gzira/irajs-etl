const _ = require('lodash')
const debug = require('debug')('elt')

class Etl {
  /**
   * 清洗数据
   * @param {mongooseModel} srcModel
   * @param {mongooseModel} targetModel
   * @param {Object} config
   */
  constructor (srcModel, targetModel, config) {
    this.srcModel = srcModel
    this.targetModel = targetModel
    this.config = config
    this.srcDoc = {}
    this.targetDoc = {}
    this.result = null
    this._valid()
  }
  _valid () {
    let srcObj = this.srcObj
    let targetObj = this.targetObj
    let fields = this.config.fields
    fields.map(f => {
      !f.srcField && this.throw('config srcField undefined')
      !f.targetField && this.throw('config targetField undefined')

      !_.has(srcObj, f.srcField) && this.throw(`srcModel has not field: ${f.srcField}`)
      !_.has(targetObj, f.targetField) && this.throw(`targetField has not field: ${f.targetField}`)
    })
  }
  throw (msg) {
    let e = new Error(msg)
    e.name = 'EtlError'
    throw e
  }
  get srcObj () {
    return this.srcModel.schema.obj
  }
  get targetObj () {
    return this.targetModel.schema.obj
  }

  /**
   * 抽取源数据
   * @param {Object} query
   */
  async extract (query = {}) {
    const doc = await this.srcModel.findOne(query).lean()
    !doc && this.throw(`extract no found: ${JSON.stringify(query)}`)
    this.srcDoc = doc
    return this
  }

  /**
   * 转换数据
   */
  async transform () {
    const srcDoc = this.srcDoc
    const fields = this.config.fields
    fields.forEach(field => {
      let targetValue = _.result(srcDoc, field.srcField)

      let _tf = field.transfer
      if (_.isFunction(_tf)) {
        targetValue = _tf(srcDoc)
      }

      // let fObj = {[field.targetField]: targetValue}
      let obj = _.set({}, field.targetField, targetValue)
      _.merge(this.targetDoc, obj)
      // Object.assign(this.targetDoc, fObj)
    })
    return this
  }

  /**
   * 写入数据
   * @param {Object} query
   */
  async load (query) {
    const doc = await this.targetModel.findOneAndUpdate(query, this.targetDoc, {new: true, upsert: true}).lean()
    !doc && this.throw(`[load] fail`)
    debug('[load] doc ', doc)
    this.result = doc
    return doc
  }
}

module.exports = Etl
