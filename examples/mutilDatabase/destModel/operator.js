
module.exports = {
  attributes: {
    userName: { type: String, index: true, comment: '用户登陆名' },
    phone: { type: String, index: true, comment: '用户手机' },
    idNo: { type: String, comment: '身份证' },
    email: { type: String, index: true, comment: '用户 email' },
    realName: { type: String, comment: '用户真实姓名' },
    role: { type: Number, default: 1, comment: '用户角色' },
    address: {
      city: { type: String, comment: '城市' },
      street: { type: String, comment: '街道' }
    },
    tags: [{
      _id: false,
      name: String,
      desc: String,
      category: String
    }],
    status: {type: String, default: 'pending', comment: '用户状态'}
  },
  statics: {},
  methods: {},
  setSchema (schema) {
  },
  db: 'irajs-etl-2',
  name: 'operators'
}
