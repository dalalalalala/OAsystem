const mongoose = require('mongoose');
const { Schema } = mongoose;
// 1、连接数据库
mongoose.connect('mongodb://localhost:27017/OASystem', { useNewUrlParser: true, useUnifiedTopology: true });

const MenuSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  router: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  icon: {
    type: String
  },
  position: {
    type: Number,
    required: true,
    default:0
  },
  parentId: {
    type: String
  },
})


module.exports = Menu = mongoose.model('menus', MenuSchema)





