const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const branchSchema = new Schema({
  branchName: String,
  city: String,
  address: String,
  mapLink: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
});

module.exports = mongoose.model('branch', branchSchema);
