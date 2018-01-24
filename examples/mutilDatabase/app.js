const Etl = require('../../lib/')
const factory = require('./factory/')
const debug = require('debug')('etl')
async function main () {
  const user = await factory.create('User')
  const etlSchema = {
    fields: [{
      srcField: 'username',
      targetField: 'userName'
    }, {
      srcField: 'mobile',
      targetField: 'phone'
    }, {
      srcField: 'idCard',
      targetField: 'idNo'
    }, {
      srcField: 'realName',
      targetField: 'realName'
    }, {
      srcField: 'userRole',
      targetField: 'role'
    }, {
      srcField: 'address.city',
      targetField: 'address.city'
    }, {
      srcField: 'address.live',
      targetField: 'address.street'
    }, {
      srcField: 'tags',
      targetField: 'tags'
    }, {
      srcField: 'status',
      targetField: 'status'
    }]
  }
  const User = factory.SrcModel.User
  const Operator = factory.DestModel.Operator
  const etl = new Etl(User, Operator, etlSchema)
  const query = {mobile: user.mobile}
  await etl.extract(query)
  await etl.transform()
  await etl.load({phone: user.mobile})
  console.log('etl result:', etl.result)
}
main()
  .then((result) => {
    process.exit(1)
  })
  .catch(err => console.log(err))
