const Coupon = require('../models/coupon');
const Cart = require('../models/cart'),
  { specialSignupMsg } = require('../msg91'),
  { specialSignupEmail } = require('../nodemailer');

module.exports = async function(user, couponArr, hdPoints) {
  let cart;
  for (let c_id of couponArr) {
    let cartConstructor = new Cart(cart ? cart : {});
    const coupon = await Coupon.findById(c_id);
    cartConstructor.add(coupon, coupon._id);
    cart = cartConstructor;
  }

  var emailCoupon = cart;
  user.cart = cart;
  const coupons = user.cart.items;

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

    //set coupon code in email coupon

    emailCoupon.items[coupon_id].code = user.unusedCoupon[coupon_id].code;

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

    //add coupon qty
    coupon.unusedCouponCustomer[user._id].qty += coupons[coupon_id].qty;
    //reduce coupon quntity
    coupon.quantity -= coupons[coupon_id].qty;

    coupon.markModified('unusedCouponCustomer');
    coupon.markModified('quantity');

    await coupon.save();
  }
  //send email customer
  await specialSignupEmail(user.email, emailCoupon, couponArr.length, hdPoints);
  //text msg customer
  await specialSignupMsg(user.number, emailCoupon, couponArr.length, hdPoints);

  user.markModified('unusedCoupon');
  user.cart = {};
  user.HdPoints = hdPoints;
  await user.save();
};
