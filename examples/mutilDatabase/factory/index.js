const FactoryGirl = require('factory-girl')
// const moment = require('moment')
const faker = require('faker')
const factory = FactoryGirl.factory
const adapter = new FactoryGirl.MongooseAdapter()
const SrcModel = require('../srcModel')
const DestModel = require('../destModel')

const ObjectId = require('mongoose').Types.ObjectId

factory.setAdapter(adapter)
faker.locale = 'zh_CN'

factory.define('User', SrcModel.User, {
  username: () => faker.name.findName(),
  mobile: () => makePhone(),
  idCard: makeNumber,
  email: () => faker.internet.email(),
  realName: () => faker.name.findName(),
  password: () => faker.internet.password(),
  address: {
    city: () => faker.address.city(),
    live: () => faker.address.streetAddress()
  },
  tags: [{
    name: () => faker.name.findName(),
    desc: () => faker.lorem.words(),
    level: () => faker.lorem.word()
  }]
})

factory.define('Operator', DestModel.Operator, {
  userName: () => faker.name.findName(),
  phone: () => makePhone(),
  idCard: makeNumber,
  email: () => faker.internet.email(),
  realName: () => faker.name.findName(),
  password: () => faker.internet.password(),
  address: {
    city: () => faker.address.city(),
    street: () => faker.address.streetAddress()
  },
  tags: [{
    name: () => faker.name.findName(),
    desc: () => faker.lorem.words(),
    level: () => faker.lorem.word()
  }]
})

// function genId () {
//   return ObjectId().toString()
// }
function makePhone (format = '13800######') {
  return faker.phone.phoneNumber(format)
}
function makeNumber (min = 10000, max) {
  let query = {
    min
  }
  if (max) {
    query.max = max
  }
  return faker.random.number(query)
}
factory.SrcModel = SrcModel
factory.DestModel = DestModel
module.exports = factory
