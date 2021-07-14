const mongoose = require('mongoose');
const { Schema } = mongoose;
// 1、连接数据库
mongoose.connect('mongodb://localhost:27017/OASystem', { useNewUrlParser: true, useUnifiedTopology: true });

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

const ApplicationSchema = new Schema({
  applicant: {
    type: String,
    required: true
  },
  approver: {
    type: String
  },
  type: {
    type: String,
    required: true
  },
  createTime: {
    type: Date,
    default:Date.now
  },
  validity: {
    type: String
  },
  beginValidity: {
    type: String,
    required: true,
    set: date => formatDate(date)
  },
  endValidity: {
    type: String,
    required: true,
    set: date => formatDate(date)
  },
  remarks: {
    type: String
  },
  isapproved: {
    type: String,
    required: true
  }
})


module.exports =  Application = mongoose.model('applications', ApplicationSchema)


