const mongoose = require('mongoose');
const { Schema } = mongoose;

const CodeSchema = new Schema({
  phone: {
    type: String,
    required: true
  },
  code: {
    type: String
  }
})

module.exports = Code = mongoose.model('codes', CodeSchema);