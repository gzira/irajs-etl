
module.exports = {
  attributes: {
    username: { type: String, index: true, comment: '用户登陆名' },
    mobile: { type: String, index: true, comment: '用户手机' },
    idCard: { type: String, comment: '身份证' },
    email: { type: String, index: true, comment: '用户 email' },
    realName: { type: String, comment: '用户真实姓名' },
    userRole: { type: Number, default: 1, comment: '用户角色' },
    address: {
      city: { type: String, comment: '城市' },
      live: { type: String, comment: '街道' }
    },
    tags: [{
      _id: false,
      name: String,
      desc: String,
      level: String
    }],
    status: {type: String, default: 'pending', comment: '用户状态'}
  },
  statics: {},
  methods: {},
  setSchema (schema) {
  },
  name: 'users'
}
