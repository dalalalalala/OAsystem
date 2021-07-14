const mongoose = require('mongoose');
const { Schema } = mongoose;
// 1、连接数据库
mongoose.connect('mongodb://localhost:27017/OASystem', { useNewUrlParser: true, useUnifiedTopology: true });

const applicattypeSchema = new Schema({
  approveName: {
    type: String,
    required: true
  },
  approveType: {
    type: String,
    required: true
  },
  approveDesc: {
    type: String
  }
})


const Applicattype = mongoose.model('Applicattype', applicattypeSchema)

new Applicattype(
  {
    approveName: '编辑',
    approveType: 'edit',
    approveDesc: '拥有该权限可进行编辑',
  },
  {
    approveName: '删除',
    approveType: 'delete',
    approveDesc: '拥有该权限可进行删除',
  },
  {
    approveName: '添加',
    approveType: 'add',
    approveDesc: '拥有该权限可进行添加',
  },
)



