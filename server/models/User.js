const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema =new Schema({
  name:{
    type:String,
    required:true
  },
  alias:{
    type:String,
    required:true
  },
  role:{
    type:String,
    default:'common'
  },
  operation:{
    type:String,
    default:'一级权限'
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  regTime: {
    type: Date,
    default: Date.now
  },
  avatar: {
    type: String,
    default:'http://localhost:5001/public/img/default-avatar.png'
  },
  code: {
    type: String
  }
})

module.exports = User = mongoose.model('users', UserSchema);
//   const User = mongoose.model('User',userSchema)

//  new User(
//    {
//    name:'admin',
//    alias:'爱迪生',
//    role:'组长',
//    phone:'15644759234',
//    password:'123',
//    email:'123@qq.com',
//    regTime:'2021-10-21',
//    headImg:'/img/aa.png',
//    code:''
//   },
//    {
//      name: 'user',
//      alias: '小兔子',
//      role: '员工',
//      phone: '18777427692',
//      password: '123',
//      email: '123231@qq.com',
//      regTime: '2021-10-21',
//      headImg: '/img/aa.png',
//      code: ''
//    },
//    {
//      name: 'test',
//      alias: '张三',
//      role: '组长',
//      phone: '14568288553',
//      password: '123',
//      email: '123ds@qq.com',
//      regTime: '2021-10-21',
//      headImg: '/img/aa.png',
//      code: ''
//    }
//   )


  
