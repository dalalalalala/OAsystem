const mongoose = require('mongoose');
const { Schema } = mongoose;
// 1、连接数据库
mongoose.connect('mongodb://localhost:27017/OASystem', { useNewUrlParser: true, useUnifiedTopology: true });

const DepartSchema = new Schema({
  departName: {
    type: String,
    required: true
  },
  director: {
    type: String,
    required: true
  },
  departDuty: {
    type: String,
    required: true
  },
  departDesc: {
    type: String
  }
})


module.exports = Depart = mongoose.model('departs', DepartSchema)



