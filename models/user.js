const mongoose = require('mongoose'),
  passportLocalMongoose = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
  username: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  number: { type: String, required: true, unique: true },

  state: { type: String },

  city: { type: String },

  district: { type: String },

  address: { type: String },

  typeAccess: { type: String },

  area: { type: String, required: true },

  businessCategory: { type: String },

  businessType: { type: String },

  businessName: { type: String },

  fassaiNumber: { type: String },

  website: { type: String },

  address: { type: String },

  establishedYear: { type: String },

  about: { type: String },

  businessKeyWords: String,

  scheduleDays: { type: String },

  scheduleTime: { type: String },

  logo: {
    public_id: String,
    secure_url: String
  },
  gallery: [{ url: String, public_id: String, link: String }],
  indexAdOne: [{ url: String, public_id: String, link: String }],
  indexSliderTwo: [{ url: String, public_id: String, link: String }],
  indexAdTwo: [{ url: String, public_id: String, link: String }],
  indexSliderThree: [{ url: String, public_id: String, link: String }],
  couponPageAd: [{ url: String, public_id: String, link: String }],
  cartAd: [{ url: String, public_id: String }],

  resetPasswordToken: String,

  resetPasswordExpires: Date,

  loginOtp: String,

  otpExpires: Date,

  emailVerifyOtp: String,
  /*
    {
        items:{
          1:{item,price:20,qty:1},2:{item,price:3,qty:1}}
        totalPrice:23,
        qty:2
    }
    1 & 2 database id of coupon
*/

  cart: { items: Object, totalPrice: Number, totalQty: Number },

  //{1:{coupon,qty,code,date},2:{....}}
  //1 is database id of coupon
  wishList: { items: Object, totalPrice: Number, totalQty: Number },

  unusedCoupon: { type: Object },

  usedCoupon: { type: Object },

  hasPaid: { type: Boolean, default: false },

  avgRating: { type: Number, default: 0 },

  isEmailVerified: { type: Boolean, default: false },

  date: { type: Date, default: Date.now },

  quotes: String,

  HdPoints: { type: Number, default: 20 },

  adminHdPoints: { type: Number, default: 0 },
  onShoppingOf: { type: Number, default: 0 },
  RedeemPercent: { type: Number, default: 0 },

  openTime: String,
  closeTime: String,

  monday: String,
  tuesday: String,
  wednesday: String,
  thursday: String,
  friday: String,
  saturday: String,
  sunday: String
});

//rating

userSchema.methods.averageRating = function(length, floorRating) {
  if (length) {
    this.avgRating = Math.round(floorRating * 10) / 10 / length;
    floorRating /= length;
    this.save();
    return Math.floor(floorRating);
  }
  this.avgRating = 0;
  this.save();
  return 0;
};

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('user', userSchema);
