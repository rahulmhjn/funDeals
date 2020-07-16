const Coupon = require('../models/coupon');
const User = require('../models/user');
const Branch = require('../models/branch');
const Review = require('../models/review');

const { cloudinary } = require('../cloudinary');

module.exports = {
  async home(req, res, next) {
    const admin = await User.find({ typeAccess: 'admin' });
    let todayDeals = new RegExp(escapeRegExp('todayDeals'), 'gi');
    let topDeals = new RegExp(escapeRegExp('topDeals'), 'gi');
    let happyHours = new RegExp(escapeRegExp('happyHours'), 'gi');
    let majorDiscount = new RegExp(escapeRegExp('majorDiscount'), 'gi');

    todayDeals = await Coupon.find({
      homeField: todayDeals,
      quantity: { $gt: 0 },
      expireDate: { $gt: Date.now() },
      isApproved: true
    })
      .populate({
        path: 'author'
      })
      .sort('-approveDate')
      .limit(8)
      .exec();
      
    topDeals = await Coupon.find({
      homeField: topDeals,
      quantity: { $gt: 0 },
      expireDate: { $gt: Date.now() },
      isApproved: true
    })
      .populate({
        path: 'author'
      })
      .sort('-approveDate')
      .exec();

    happyHours = await Coupon.find({
      homeField: happyHours,
      quantity: { $gt: 0 },
      expireDate: { $gt: Date.now() },

      isApproved: true
    })
      .populate({
        path: 'author'
      })
      .sort('-approveDate')
      .limit(8)
      .exec();

    majorDiscount = await Coupon.find({
      homeField: majorDiscount,
      quantity: { $gt: 0 },
      expireDate: { $gt: Date.now() },

      isApproved: true
    })
      .populate({
        path: 'author'
      })
      .sort('-approveDate')
      .limit(8)
      .exec();
    // prettier-ignore
    res.render("index/home", {todayDeals,topDeals,happyHours,majorDiscount,admin:admin[0]});
  },

  async userProfile(req, res, next) {
    const user = await User.findById(req.user._id);
    res.render('index/showUser.ejs', { user });
  },

  selectCity(req, res, next) {
    req.session.city = req.params.city;

    return res.redirect('back');
  },

  async showMerchant(req, res, next) {
    const merchant = await User.findById(req.params.merchant_id);
    const reviews = await Review.find({ merchant: req.params.merchant_id })
      .populate({ path: 'author' })
      .sort('-_id')
      .exec();
    floorRating = 0;
    const branch = await Branch.find({ author: req.params.merchant_id });

    if (reviews.length) {
      reviews.forEach(review => {
        floorRating += review.rating;
      });
    }

    floorRating = merchant.averageRating(reviews.length, floorRating);

    const merchantCoupon = await Coupon.find({
      author: req.params.merchant_id,
      expireDate: { $gt: Date.now() },
      isApproved: true
    });

    res.render('index/showMerchant.ejs', {
      merchant,
      reviews,
      merchantCoupon,
      floorRating,
      branch
    });
  },

  async myorder(req, res, next) {
    const unusedcoupon = req.user.unusedCoupon;
    const usedcoupon = req.user.usedCoupon;
    if (unusedcoupon && usedcoupon) {
      unusedcouponArr = [];
      for (coupon_id in unusedcoupon) {
        unusedcouponArr.push(coupon_id);
      }
      usedcouponArr = [];
      for (coupon_id in usedcoupon) {
        usedcouponArr.push(coupon_id);
      }
      //find data from array of id
      // prettier-ignore
      const unusedcouponData = await Coupon.find({ _id: { $in: unusedcouponArr } });
      // prettier-ignore
      const usedcouponData = await Coupon.find({ _id: { $in: usedcouponArr } });

      return res.render('index/myorder.ejs', {
        unusedcouponData,
        usedcouponData
      });
    } else if (!unusedcoupon && !usedcoupon) {
      return res.render('index/myorder.ejs', {
        unusedcouponData: '',
        usedcouponData: ''
      });
    } else if (!unusedcoupon) {
      usedcouponArr = [];
      for (coupon_id in usedcoupon) {
        usedcouponArr.push(coupon_id);
      }
      //find data from array of id
      // prettier-ignore
      const usedcouponData = await Coupon.find({ _id: { $in: usedcouponArr } });

      return res.render('index/myorder.ejs', {
        unusedcouponData: '',
        usedcouponData
      });
    } else {
      unusedcouponArr = [];
      for (coupon_id in unusedcoupon) {
        unusedcouponArr.push(coupon_id);
      }
      //find data from array of id
      // prettier-ignore
      const unusedcouponData = await Coupon.find({ _id: { $in: unusedcouponArr } });

      return res.render('index/myorder.ejs', {
        unusedcouponData,
        usedcouponData: ''
      });
    }
  },

  async updateProfile(req, res, next) {
    const user = req.user;

    const checkUser = await User.findOne({ email: req.body.email });
    if (req.file) {
      if (user.logo.public_id)
        await cloudinary.v2.uploader.destroy(user.logo.public_id);
      const { secure_url, public_id } = req.file;
      req.body.logo = { secure_url, public_id };
    }

    if (
      req.body.email !== req.user.email &&
      (checkUser && checkUser.email !== req.user.email)
    ) {
      //check whether email exists
      req.session.error = 'email already exists';
      res.redirect('back');
    }
    req.session.success = 'Profile updated successfully!!';
    await User.findByIdAndUpdate(user._id, req.body);
    res.redirect('back');
  }
};

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
