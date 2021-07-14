const mongoose = require('mongoose');
const { Schema } = mongoose;
const moment = require('moment')

// 1、连接数据库
mongoose.connect('mongodb://localhost:27017/OASystem', { useNewUrlParser: true, useUnifiedTopology: true });

const NoteSchema = new Schema({
  createUser: {
    type: String,
    required: true
  },
  noteTitle: {
    type: String,
    required: true
  },
  noteContent: {
    type: String,
    required: true
  },
  createTime: {
    type: Date,
    default: Date.now
  }
})


module.exports = Note = mongoose.model('notes', NoteSchema)

// new Note(
//   {
//     createUser: '编辑',
//     noteTitle: 'edit',
//     noteContent: '拥有该权限可进行编辑',
//     createTime: '',
//   },
//   {
//     createUser: '删除',
//     noteTitle: 'delete',
//     noteContent: '拥有该权限可进行删除',
//     createTime: '',
//   },
//   {
//     createUser: '添加',
//     noteTitle: 'add',
//     noteContent: '拥有该权限可进行添加',
//     createTime: '',
//   },
// )



