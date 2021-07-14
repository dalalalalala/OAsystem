const mongoose = require('mongoose');
const { Schema } = mongoose;
// 1、连接数据库
mongoose.connect('mongodb://localhost:27017/OASystem', { useNewUrlParser: true, useUnifiedTopology: true });

const taskSchema = new Schema({
  userName: {
    type: String,
    required: true
  },
  taskTotal: {
    type: Number,
    required: true
  }
})


const Task = mongoose.model('Task', taskSchema)

new Task(
  {
    userName: '编辑',
    taskTotal: 'edit',
  },
  {
    userName: '删除',
    taskTotal: 'delete',
  },
  {
    userName: '添加',
    taskTotal: 'add',
  },
)



