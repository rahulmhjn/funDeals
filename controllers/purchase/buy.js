const Coupon = require('../../models/coupon'),
  Cart = require('../../models/cart'),
  User = require('../../models/user'),
  sha = require('crypto-js/hmac-sha256'),
  { customerOrderMsg } = require('../../msg91'),
  { customerOrderEmail, merchantBoughtEmail } = require('../../nodemailer');

module.exports = {
  async purchaseCoupons(req, res, next) {
    const user = await User.findById(req.user.id);
    const admin = await User.findOne({ typeAccess: 'admin' });
    const coupons = user.cart.items;
    var emailCoupon = {};
    //prettier-ignore
    // generated_signature = sha(
    //   req.body.razorpay_order_id + '|' + req.body.razorpay_payment_id,
    //   process.env.razorpayKeySecret
    // );
    // if (generated_signature != req.body.razorpay_signature) {
    //   return invalidaccess;
    // }
    //RazorPay Verification Code End
    if (!user.unusedCoupon) {
      user.unusedCoupon = {};
    }
    //add coupon to user's unused coupon
    for (coupon_id in coupons) {
      let storedItem = user.unusedCoupon[coupon_id];
      //check whether coupon doesn't exists
      if (!storedItem) {
        user.unusedCoupon[coupon_id] = {
          qty: 0,
          code: Math.floor(Math.random() * 1000000 + 1).toString(),
          date: Date.now(),
          couponAuthor: coupons[coupon_id].item.author
        };
      }

      //add coupon qty
      user.unusedCoupon[coupon_id].qty += coupons[coupon_id].qty;
    }
    //add sold qty
    for (coupon_id in coupons) {
      const coupon = await Coupon.findById(coupon_id);
      const sold = coupon.sold + coupons[coupon_id].qty;
      coupon.sold = sold;
      await coupon.save();
    }

    let cart = new Cart(req.user.cart ? req.user.cart : {});
    var emailCoupon = cart;

    //add coustomer to all coupons in cart
    for (coupon_id in coupons) {
      const coupon = await Coupon.findById(coupon_id).populate({
        path: 'author'
      });
      if (!coupon.unusedCouponCustomer) {
        coupon.unusedCouponCustomer = {};
      }
      let storedItem = coupon.unusedCouponCustomer[user._id];
      //check whether customer doesn't exists in unusedCouponCustomer
      if (!storedItem) {
        coupon.unusedCouponCustomer[user._id] = {
          username: user.username,
          email: user.email,
          number: user.number,
          qty: 0,
          code: user.unusedCoupon[coupon_id].code,
          date: user.unusedCoupon[coupon_id].date,
          couponAuthor: coupon.author._id
        };
      }
      //set coupon code in email coupon

      emailCoupon.items[coupon_id].code = user.unusedCoupon[coupon_id].code;

      //add coupon qty
      coupon.unusedCouponCustomer[user._id].qty += coupons[coupon_id].qty;
      //reduce coupon quntity
      coupon.quantity -= coupons[coupon_id].qty;

      //HdPoints addtion
      const couponsPrice = cart.totalPrice;
      const totalPrice = couponsPrice + couponsPrice * 0.18;
      if (admin.onShoppingOf) {
        var points = Math.floor(totalPrice / admin.onShoppingOf);
      } else {
        points = 0;
      }
      if (points) {
        user.HdPoints += points * admin.adminHdPoints;
      }
     
      // HD Points logic start here
      if (req.params.HdStatus == 'HdPoints') {
        var ttotalPrice = req.user.cart.totalPrice;
        var pricePercent = Math.floor(
          ttotalPrice * (admin.RedeemPercent / 100)
        );
        var HdPoints = req.user.HdPoints;

        if (HdPoints >= pricePercent) {
          HdPoints = HdPoints - pricePercent;
          user.HdPoints = user.HdPoints - pricePercent;
        } else {
          HdPoints = 0;
          user.HdPoints = 0;
        }
      }

      //send email merchant
      await merchantBoughtEmail(
        coupon.author.email,
        coupon.offerName,
        user.unusedCoupon[coupon_id].code
      );

      coupon.markModified('unusedCouponCustomer');
      coupon.markModified('quantity');
      await coupon.save();
    }

    //send email customer
    await customerOrderEmail(req.user.email, emailCoupon);
    //text msg customer
    await customerOrderMsg(req.user.number, emailCoupon);
    //empty cart
    cart.orderPlaced();
    user.cart = cart;

    //use this method becoz high data processing otherwise won't save to db
    user.markModified('unusedCoupon');
    await user.save();

    req.session.success = `${user.username} your order placed successfully `;
    return res.redirect('/myorder');
  },
  getHdPoint(req, res, next) {
    res.render('purchase/hdPoint');
  }
};
