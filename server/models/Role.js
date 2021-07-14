const mongoose = require('mongoose');
const { Schema } = mongoose;

// 表  从这里开始写！！！所有的表id都不用写
const RoleSchema = new Schema({
  type: {
    type: String,     //类型
    required: true   //是否允许为空，默认false为允许，true为不允许为空。当前键名为不允许空
  },
  name: {
    type: String,
    required: true
  },
  departId: {
    type: String,
    required: true
  },
  operation: {
    type: String,  //不写required: true则默认允许空，当前键名为允许空
    default:'一级权限'
  },
  roleDesc: {
    type: String,
    default:'暂无描述'
  }
})


module.exports = Role = mongoose.model('roles', RoleSchema);

// new Role(
//   {
//     type: 'chairman',
//     name: '董事长',
//     departId: '0122',
//     operation: ['delete','edit','add'],
//     roleDesc: '公司大佬'
//   },
//   {
//     type: 'manager',
//     name: '项目经理',
//     departId: '0133',
//     operation: ['delete', 'edit', 'add'],
//     roleDesc: '管理项目头头'
//   },
//   {
//     type: 'headman',
//     name: '组长',
//     departId: '0144',
//     operation: ['delete', 'edit', 'add'],
//     roleDesc: '小组组长'
//   },
//   {
//     type: 'staff',
//     name: '员工',
//     departId: '0155',
//     operation: ['delete', 'add'],
//     roleDesc: '底层员工'
//   }
// )



