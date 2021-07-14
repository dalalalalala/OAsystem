const mongoose = require('mongoose');
const { Schema } = mongoose;
// 1、连接数据库
mongoose.connect('mongodb://localhost:27017/OASystem', { useNewUrlParser: true, useUnifiedTopology: true });

const messageSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  typeId: {
    type: String,
    required: true
  },
  createTime: {
    type: Date,
    required: true
  },
  remarks: {
    type: String
  }
})


const Message = mongoose.model('Message', messageSchema)

new Message(
  {
    title: '编辑',
    content: 'edit',
    typeId: '拥有该权限可进行编辑',
    createTime: '',
    remarks: '',
  },
  {
    title: '删除',
    content: 'delete',
    typeId: '拥有该权限可进行删除',
    createTime: '',
    remarks: '',
  },
  {
    title: '添加',
    content: 'add',
    typeId: '拥有该权限可进行添加',
    createTime: '',
    remarks: '',
  },
)



