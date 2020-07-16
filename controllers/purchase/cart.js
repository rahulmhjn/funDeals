const Cart = require('../../models/cart'),
  Coupon = require('../../models/coupon'),
  User = require('../../models/user');
const Razorpay = require('razorpay');

module.exports = {
  async showCart(req, res, next) {
    const { cart } = req.user;
    cartArr = [];

    for (coupon_id in cart.items) {
      cartArr.push(coupon_id);
    }

    const coupons = await Coupon.find({ _id: { $in: cartArr } });

    var couponObj = {};
    coupons.map(coupon => {
      couponObj[coupon._id] = coupon.quantity;
    });

    //cart add

    var instance = new Razorpay({
      key_id: process.env.razorpayKeyId,
      key_secret: process.env.razorpayKeySecret
    });
    const admin = await User.findOne({ typeAccess: 'admin' });
    if (req.user.cart.totalPrice) {
      totalPrice = req.user.cart.totalPrice;
      var taxedPrice = req.user.cart.totalPrice * 0.18;
      var newTotalPrice = taxedPrice + req.user.cart.totalPrice;

      var redeemedPrice = 0;
    }
    if (!req.user.cart.totalPrice) {
      let orderId = 'abc';
      res.render('purchase/cart.ejs', { orderId, couponObj });
    } else {
      newTotalPrice = newTotalPrice * 100;
      amount = Math.round(newTotalPrice);

      var options = {
        amount, // amount in the smallest currency unit
        currency: 'INR',
        receipt: 'order_rcptid_11',
        payment_capture: '0'
      };

      instance.orders.create(options, function(err, order) {
        const orderId = order.id;
        const HDstatus = 'NoHdPoints';
        res.render('purchase/cart.ejs', {
          orderId,
          HDstatus,
          taxedPrice,
          newTotalPrice,
          redeemedPrice,
          couponObj,
          redeemPercent: admin.RedeemPercent,
          cartAd: admin.cartAd[0]
        });
      });
    }
  },

  async showHdCart(req, res, next) {
    const { cart } = req.user;
    cartArr = [];

    for (coupon_id in cart.items) {
      cartArr.push(coupon_id);
    }

    const coupons = await Coupon.find({ _id: { $in: cartArr } });

    var couponObj = {};
    coupons.map(coupon => {
      couponObj[coupon._id] = coupon.quantity;
    });

    if (!req.user.HdPoints) {
      req.session.error = "You do'nt have any Hd Points Yet";
      return res.redirect('/cart', { couponObj });
    }

    var instance = new Razorpay({
      key_id: process.env.razorpayKeyId,
      key_secret: process.env.razorpayKeySecret
    });
    // HD Points logic start here
    const admin = await User.findOne({ typeAccess: 'admin' });

    if (req.user.HdPoints) {
      var totalPrice = req.user.cart.totalPrice;
      var pricePercent = Math.floor(totalPrice * (admin.RedeemPercent / 100));
      var HdPoints = req.user.HdPoints;

      if (HdPoints >= pricePercent) {
        totalPrice = totalPrice - pricePercent;

        HdPoints = HdPoints - pricePercent;
      } else {
        totalPrice = totalPrice - HdPoints;
        HdPoints = 0;
      }

      var taxedPrice = totalPrice * 0.18;
      var newTotalPrice = taxedPrice + totalPrice;
    }

    var redeemedPrice = req.user.cart.totalPrice - totalPrice;

    // Hd points logic ends here
    // if (req.user.cart.totalPrice) {
    //   var totalPrice = req.user.cart.totalPrice;
    //   var taxedPrice = req.user.cart.totalPrice * 0.02;
    //   var newTotalPrice = taxedPrice + req.user.cart.totalPrice;
    // }

    if (!req.user.cart.totalPrice) {
      let orderId = 'abc';
      res.render('purchase/cart.ejs', { orderId, couponObj });
    } else {
      newTotalPrice = newTotalPrice * 100;
      amount = Math.round(newTotalPrice);
      var options = {
        amount, // amount in the smallest currency unit
        currency: 'INR',
        receipt: 'order_rcptid_11',
        payment_capture: '0'
      };
      instance.orders.create(options, function(err, order) {
        const orderId = order.id;
        const HDstatus = 'HdPoints';
        res.render('purchase/cart.ejs', {
          orderId,
          HDstatus,
          taxedPrice,
          newTotalPrice,
          redeemedPrice,
          couponObj,
          redeemPercent: admin.RedeemPercent,
          cartAd: admin.cartAd[0]
        });
      });
    }
  },

  async addToCart(req, res, next) {
    const { c_id } = req.params;
    let cartConstructor = new Cart(req.user.cart ? req.user.cart : {});

    const coupon = await Coupon.findById(c_id);
    const user = await User.findById(req.user._id);
    let { cart } = user;

    //check if item in cart more than item available in stock
    if (cart.totalQty && cart.totalQty > 0) {
      if (
        cart.items[c_id] &&
        cart.items[c_id].qty >= cart.items[c_id].item.quantity
      ) {
        req.session.error = 'Sorry coupon exhausted try next time !!';
        return res.redirect('back');
      }
    }

    //check coupon qty
    if (coupon.quantity <= 0) {
      req.session.error = 'Sorry coupon exhausted try next time !!';
      return res.redirect('back');
    }

    cartConstructor.add(coupon, coupon._id);
    user.cart = cartConstructor;

    await user.save();
    req.session.success = 'Coupon in cart added successfully !!';
    return res.redirect('/cart');
  },

  async mulToCart(req, res, next) {
    const { c_id, mul_qty } = req.params;
    let cartConstructor = new Cart(req.user.cart ? req.user.cart : {});

    const coupon = await Coupon.findById(c_id);
    const user = await User.findById(req.user._id);
    let { cart } = user;

    //check coupon qty
    if (coupon.quantity <= 0) {
      req.session.error = 'Sorry coupon exhausted try next time !!';
      return res.redirect('back');
    }

    cartConstructor.multiply(coupon, coupon._id, mul_qty);
    user.cart = cartConstructor;

    await user.save();

    return res.redirect('/cart');
  },

  async reduceCartQtyByOne(req, res, next) {
    if (!req.user || !req.user.cart) {
      return res.redirect('back');
    }
    let cart = new Cart(req.user.cart ? req.user.cart : {});
    const user = await User.findById(req.user._id);
    cart.reduceByOne(req.params.c_id);
    user.cart = cart;
    await user.save();
    req.session.success = 'Coupon quantiy reduced successfully !!';
    res.redirect('/cart');
  },

  async moveToWishList(req, res, next) {
    const { c_id } = req.params;
    let wishListConstructor = new Cart(
      req.user.wishList ? req.user.wishList : {}
    );
    let cart = new Cart(req.user.cart ? req.user.cart : {});
    const coupon = await Coupon.findById(c_id);
    const user = await User.findById(req.user._id);

    wishListConstructor.add(coupon, coupon._id);
    user.wishList = wishListConstructor;
    cart.remove(c_id);
    user.cart = cart;

    await user.save();
    req.session.success = 'Coupon in wish list added successfully !!';
    return res.redirect('back');
  },

  async removeItemFromCart(req, res, next) {
    if (!req.user || !req.user.cart) {
      return res.redirect('back');
    }
    let cart = new Cart(req.user.cart ? req.user.cart : {});
    const user = await User.findById(req.user._id);
    cart.remove(req.params.c_id);
    user.cart = cart;
    await user.save();

    res.redirect('/cart');
  },

  async addToCartBack(req, res, next) {
    const { c_id } = req.params;
    let cartConstructor = new Cart(req.user.cart ? req.user.cart : {});

    const coupon = await Coupon.findById(c_id);
    const user = await User.findById(req.user._id);
    let { cart } = user;

    //check if item in cart more than item available in stock
    if (cart.totalQty && cart.totalQty > 0) {
      if (
        cart.items[c_id] &&
        cart.items[c_id].qty >= cart.items[c_id].item.quantity
      ) {
        req.session.error = 'Sorry coupon exhausted try next time !!';
        return res.redirect('back');
      }
    }

    //check coupon qty
    if (coupon.quantity <= 0) {
      req.session.error = 'Sorry coupon exhausted try next time !!';
      return res.redirect('back');
    }

    cartConstructor.add(coupon, coupon._id);
    user.cart = cartConstructor;

    await user.save();
    req.session.success = 'Coupon in cart added successfully!!';
    return res.redirect('back');
  }
};
