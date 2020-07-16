const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  body: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  //for coupon review
  coupon: {
    type: Schema.Types.ObjectId,
    ref: "Coupon"
  },
  //for merchant review
  merchant: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  rating: Number,
  date: { type: Date, default: Date.now }
    
});

module.exports = mongoose.model("Review", ReviewSchema);
