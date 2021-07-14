const mongoose = require('mongoose');
const { Schema } = mongoose;
const moment = require('moment')
// 1、连接数据库
mongoose.connect('mongodb://localhost:27017/OASystem', { useNewUrlParser: true, useUnifiedTopology: true });

const ItemStepSchema = new Schema({
  itemID: {
    type: String,
    required: true
  },
  title:{
    type: String,
    required: true
  },
  endTime:{
    type:Date,
    default: Date.now
  },
  status: {
    type: String,
    default:'wait'
  },
  description: {
    type: String
  },
  content: {
    type: String
  },
})


module.exports = ItemStep = mongoose.model('itemSteps', ItemStepSchema)




