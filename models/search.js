const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const searchSchema = new Schema({
  identifier:{type:String},
  search:[String],
  food:[String],
  fashion:[String],
  others:[String]

});

module.exports = mongoose.model('search', searchSchema);
