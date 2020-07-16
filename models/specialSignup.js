const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const specialSignupSchema = new Schema({
  hdPoints: Number,
  coupons: { type: Array },
  name: String
});

module.exports = mongoose.model('specialSignup', specialSignupSchema);
