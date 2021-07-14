const mongoose = require('mongoose');
const { Schema } = mongoose;
// 1、连接数据库
mongoose.connect('mongodb://localhost:27017/OASystem', { useNewUrlParser: true, useUnifiedTopology: true });

const messtypeSchema = new Schema({
  messName: {
    type: String,
    required: true
  },
  messType: {
    type: String,
    required: true
  },
  messDesc: {
    type: String
  }
})


const Messtype = mongoose.model('Messtype', messtypeSchema)

new Messtype(
  {
    messName: '编辑',
    messType: 'edit',
    messDesc: '拥有该权限可进行编辑',
  },
  {
    messName: '删除',
    messType: 'delete',
    messDesc: '拥有该权限可进行删除',
  },
  {
    messName: '添加',
    messType: 'add',
    messDesc: '拥有该权限可进行添加',
  },
)



