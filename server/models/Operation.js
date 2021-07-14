const mongoose = require('mongoose');
const { Schema } = mongoose;
const moment = require('moment')

const OperationSchema = new Schema({
  operator: {
    type: String,
    required: true
  },
  operPlace: {
    type: String,
    required: true
  },
  operAction: {
    type: String,
    required: true
  },
  operContent: {
    type: String
  },
  operContentId: {
    type: String
  },
  avatar:{
    type:String,
    default:'http://localhost:5001/public/img/default-avatar.png'
  },
  operTime: {
    type: Date,
    default: Date.now,
    get: v => moment(v).format('YYYY-MM-DD HH:mm')
  }
})


module.exports = Operation = mongoose.model('operations', OperationSchema)




