const mongoose = require('mongoose');
const { Schema } = mongoose;
const moment = require('moment')

// 1、连接数据库
mongoose.connect('mongodb://localhost:27017/OASystem', { useNewUrlParser: true, useUnifiedTopology: true });

const loginlogSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  loginTime: {
    type: Date,
    required: true,
    get: v => moment(v).format('YYYY-MM-DD HH:mm')
  }
})


const Loginlog = mongoose.model('Loginlog', loginlogSchema)

new Loginlog(
  {
    userId: '编辑',
    loginTime: 'edit',
  },
  {
    userId: '删除',
    loginTime: 'delete',
  },
  {
    userId: '添加',
    loginTime: 'add',
  },
)



