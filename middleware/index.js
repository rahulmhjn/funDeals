const User = require('../models/user');
const Review = require('../models/review');
const Coupon = require('../models/coupon');

const middleware = {
  asyncErrorHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  },

  setTypeAccess(req, res, next) {
    //to make user admin
    if (req.body.adminCode && req.body.adminCode === process.env.adminCode) {
      req.body.typeAccess = 'admin';
      return next();
    }
    if (req.body.businessType) {
      req.body.typeAccess = 'merchant';
      return next();
    } else {
      req.body.typeAccess = 'user';
      return next();
    }
  },
  checkInput(req, res, next) {
    if (req.body.password !== req.body.confirmPassword) {
      req.session.error = 'Password and confirm password should match!!';
      return res.redirect('back');
    }
    return next();
  },

  isLoggedIn(req, res, next) {
    if (req.isAuthenticated() && req.user.isEmailVerified) return next();

    if (req.isAuthenticated() && !req.user.isEmailVerified) {
      req.session.error = 'Your email is not verified!!';
      return res.redirect('/auth/verify-email');
    }

    req.session.error = 'You need to log in first !!';
    req.session.redirectTo = req.originalUrl;
    return res.redirect('/auth/login');
  },

  isReviewAuthor: async (req, res, next) => {
    let review = await Review.findById(req.params.review_id);
    if (review.author.equals(req.user._id)) {
      return next();
    }
    req.session.error = 'Bye bye';
    return res.redirect('/coupons');
  },

  isMerchant: async (req, res, next) => {
    if (req.user.typeAccess == 'merchant' && req.user.hasPaid == false) {
      return res.render('auth/merchantPayment.ejs');
    }

    if (req.user.typeAccess == 'merchant' || req.user.typeAccess === 'admin') {
      return next();
    }
    req.session.error = 'you can not do coupon opertions';
    return res.redirect('/');
  },

  isAdmin: async (req, res, next) => {
    if (req.user.typeAccess === 'admin') {
      return next();
    }
    req.session.error = 'you are not admin';
    return res.redirect('/');
  },

  setSchedule: async (req, res, next) => {
    console.log(req.body);
    if (req.body.monday === 'Open') {
      req.body.monday = 'Open';
    } else {
      req.body.monday = 'Closed';
    }

    if (req.body.tuesday === 'Open') {
      req.body.tuesday = 'Open';
    } else {
      req.body.tuesday = 'Closed';
    }
    if (req.body.wednesday === 'Open') {
      req.body.wednesday = 'Open';
    } else {
      req.body.wednesday = 'Closed';
    }
    if (req.body.thursday === 'Open') {
      req.body.thursday = 'Open';
    } else {
      req.body.thursday = 'Closed';
    }
    if (req.body.friday === 'Open') {
      req.body.friday = 'Open';
    } else {
      req.body.friday = 'Closed';
    }
    if (req.body.saturday === 'Open') {
      req.body.saturday = 'Open';
    } else {
      req.body.saturday = 'Closed';
    }
    if (req.body.sunday === 'Open') {
      req.body.sunday = 'Open';
    } else {
      req.body.sunday = 'Closed';
    }
    return next();
  },

  async checkCouponQuantity(req, res, next) {
    const coupon = req.user.cart.items;
    let error = null;
    check = true;
    for (coupon_id in coupon) {
      const coupon = await Coupon.findById(coupon_id);
      if (coupon.quantity < 1) {
        check = false;
        error = 'coupon exhausted sorry try next time!!';
      }
      if (coupon.expireDate < Date.now()) {
        check = false;
        error = 'coupon expired sorry try next time!!';
      }
    }
    if (check) {
      return next();
    }

    req.session.error = error;
    res.redirect('back');
  },
  async redirectMer(req, res, next) {
    if (req.user) {
      if (req.user.typeAccess == 'merchant' && req.user.hasPaid == false) {
        return res.render('auth/merchantPayment.ejs');
      }

      if (req.user.typeAccess == 'merchant' && req.user.hasPaid == true) {
        return res.redirect('/merchantDashboard/offer');
      }
    }

    return next();
  },
  async redirectAdmin(req, res, next) {
    if (req.user) {
     
      if (req.user.typeAccess == 'admin') {
        return res.redirect('/adminDashboard/coupon');
      }
    }

    return next();
  }
};

module.exports = middleware;
