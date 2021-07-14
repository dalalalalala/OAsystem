const mongoose = require('mongoose');
const { Schema } = mongoose;
// 1、连接数据库
mongoose.connect('mongodb://localhost:27017/OASystem', { useNewUrlParser: true, useUnifiedTopology: true });

const TaskSchema = new Schema({
  taskName: {
    type: String,
    required: true
  },
  itemId: {
    type: String,
    required: true
  },
  itemStepId: {
    type: String,
    required: true
  },
  member: {
    type: String,
    required: true
  },
  content:{
    type:String,
  },
  createTime: {
    type: Date,
    required: true,
    default:Date.now()
  },
  endTime: {
    type: Date,
    required: true
  },
  taskPer: {
    type: Number,
    required: true,
    default: 0
  },
  isBegin: {
    type: String,
    required: true,
    default:'未开始'
  },
  isOverdue: {
    type: Number,
    required: true,
    default: 0
  },
  isFinish: {
    type: Number,
    required: true,
    default: 0
  },
})


module.exports =  Task = mongoose.model('tasks', TaskSchema)




