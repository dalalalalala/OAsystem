const mongoose = require('mongoose');
const { Schema } = mongoose;
const moment = require('moment')
// 1、连接数据库
mongoose.connect('mongodb://localhost:27017/OASystem', { useNewUrlParser: true, useUnifiedTopology: true });

const ItemsSchema = new Schema({
  itemName: {
    type: String,
    required: true
  },
  createName:{
    type: String,
    required: true
  },
  userName: {
    type: Array,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  duty: {
    type: String,
    required: true
  },
  fileName:{
    type:String
  },
  filePath: {
    type: String
  },
  createTime:{
    type: Date,
    default: Date.now,
    get: v => moment(v).format('YYYY-MM-DD')
  },
  endTime: {
    type: Date,
    required: true,
    get: v => moment(v).format('YYYY-MM-DD')
  },
  itemPer: {
    type: Number,
    required: true,
    default:0
  },
  isBegin: {
    type: String,
    required: true,
    default: '未开始'
  },
  isOverdue: {
    type: Number,
    required: true,
    default:0
  },
  isFinish: {
    type: Number,
    required: true,
    default:0
  },
})


module.exports = Items = mongoose.model('items', ItemsSchema)

// new Items(
//   {
//     itemName: '编辑',
//     userName: 'edit',
//     type: '拥有该权限可进行编辑',
//     duty: '',
//     createTime:'',
//     endTime:'',
//     itemStep:'',
//     itemPer:'',
//     isBegin:'',
//     isOverdue:'',
//     isFinish:''
//   },
//   {
//     itemName: '删除',
//     userName: 'delete',
//     type: '拥有该权限可进行删除',
//     duty: '',
//     createTime:'',
//     endTime:'',
//     itemStep:'',
//     itemPer:'',
//     isBegin:'',
//     isOverdue:'',
//     isFinish:''
//   },
//   {
//     itemName: '添加',
//     userName: 'add',
//     type: '拥有该权限可进行添加',
//     duty: '',
//     createTime:'',
//     endTime:'',
//     itemStep:'',
//     itemPer:'',
//     isBegin:'',
//     isOverdue:'',
//     isFinish:''
//   },
// )



