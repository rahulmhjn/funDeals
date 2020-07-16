const express = require('express'),
  router = express.Router(),
  {
    asyncErrorHandler,
    isLoggedIn,
    checkCouponQuantity
  } = require('../../middleware'),
  { purchaseCoupons, getHdPoint } = require('../../controllers/purchase/buy');
const Razorpay = require("razorpay");
var sha = require("crypto-js/hmac-sha256");

//@Route    POST '/buy/:HdStatus'
//@desc     to purchase all coupons inside cart
//@access   Private

router.post(
  "/:HdStatus",
  isLoggedIn,
  asyncErrorHandler(checkCouponQuantity),
  asyncErrorHandler(purchaseCoupons)
);

//@Route    GET '/buy/hdPoint'
//@desc     to get hd point
//@access   Private

router.get(
  "/hdPoint",
  isLoggedIn,
  asyncErrorHandler(getHdPoint)
);

module.exports = router;
