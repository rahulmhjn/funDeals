const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const mongoosePaginate = require('mongoose-paginate');

const couponSchema = mongoose.Schema({
  offerDetail: { type: String },
  offerPercentage: { type: Number },

  offerAmount: { type: Number },

  image: { url: String, public_id: String },

  offerType: { type: String, required: true },

  offerName: { type: String },

  approveDate: { type: Date },

  quantity: { type: Number, required: true },

  merchantAmount: { type: Number },

  searchKeyWords: String,

  exactSearch: String,

  city: String,

  businessName: { type: String },

  filterKeyWords: String,

  avgRating: { type: Number, default: 0 },

  homeField: String,

  adminAmount: { type: Number },
  couponType: { type: String },
  startDate: { type: Date, required: true },
  expireDate: { type: Date, required: true },
  startTime: { type: String },

  expireTime: { type: String },

  isPending: { type: Boolean, default: true },

  isRejected: { type: Boolean, default: false },

  isApproved: { type: Boolean, default: false },
  //{1:{coupon,qty,code,price,date},2:{....}}
  //1 is database id of coupon
  unusedCouponCustomer: { type: Object },

  usedCouponCustomer: { type: Object },

  author: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },

  sold: {
    type: Number,
    default: 0
  },
  approvalDate: { type: Date, default: Date.now },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]

  //image
});

couponSchema.pre('remove', async function() {
  console.log('removing coupon reviews');
  await Review.remove({
    _id: {
      $in: this.reviews
    }
  });
});

//for pagination
couponSchema.plugin(mongoosePaginate);

//rating

couponSchema.methods.averageRating = function() {
  let floorRating = 0;
  if (this.reviews.length) {
    this.reviews.forEach(review => {
      floorRating += review.rating;
    });
    this.avgRating = Math.round(floorRating * 10) / 10 / this.reviews.length;
    floorRating /= this.reviews.length;
    this.save();
    return Math.floor(floorRating);
  }
  this.avgRating = 0;
  this.save();
  return 0;
};

module.exports = mongoose.model('Coupon', couponSchema);
