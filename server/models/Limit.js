const mongoose = require('mongoose');
const { Schema } = mongoose;
// 1、连接数据库
mongoose.connect('mongodb://localhost:27017/OASystem', { useNewUrlParser: true, useUnifiedTopology: true });

const LimitSchema = new Schema({
  limitName: {
    type: String,
    required: true
  },
  limitMenu: {
    type: Array,
  },
  limitDesc: {
    type: String
  }
})


module.exports = Limit = mongoose.model('limits', LimitSchema);



