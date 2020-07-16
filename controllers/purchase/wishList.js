const Cart = require("../../models/cart"),
  Coupon = require("../../models/coupon"),
  User = require("../../models/user");

module.exports = {
  async showWishList(req, res, next) {
    const { wishList } = req.user;
    wishListArr = [];

    for (coupon_id in wishList.items) {
      wishListArr.push(coupon_id);
    }

    const coupons = await Coupon.find({ _id: { $in: wishListArr } })
      .populate({
        path: "author"
      })
      .exec();

    var wishListObj = {};
    coupons.map(coupon => {
      wishListObj[coupon._id] = coupon.quantity;
    });

    return res.render("purchase/wishList.ejs", { wishListObj });
  },

  async addToWishList(req, res, next) {
    const { c_id } = req.params;
    let wishListConstructor = new Cart(
      req.user.wishList ? req.user.wishList : {}
    );

    const coupon = await Coupon.findById(c_id);
    const user = await User.findById(req.user._id);

    wishListConstructor.add(coupon, coupon._id);
    user.wishList = wishListConstructor;

    await user.save();
    req.session.success = "Coupon in wish list added successfully !!";
    return res.redirect("back");
  },

  async moveToCart(req, res, next) {
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
        req.session.error = "Sorry coupon exhausted try next time !!";
        return res.redirect("back");
      }
    }

    //check coupon qty
    if (coupon.quantity <= 0) {
      req.session.error = "Sorry coupon exhausted try next time !!";
      return res.redirect("back");
    }

    cartConstructor.add(coupon, coupon._id);
    user.cart = cartConstructor;

    let wishList = new Cart(req.user.wishList ? req.user.wishList : {});

    wishList.remove(c_id);
    user.wishList = wishList;
    await user.save();
    req.session.success = "coupon moved to cart successfully !!";
    res.redirect("/wish-list");
  },

  async removeItemFromWishList(req, res, next) {
    if (!req.user || !req.user.wishList) {
      return res.redirect("back");
    }
    const user = await User.findById(req.user._id);
    let wishList = new Cart(req.user.wishList ? req.user.wishList : {});

    wishList.remove(req.params.c_id);
    user.wishList = wishList;
    await user.save();

    res.redirect("/wish-list");
  }
};
