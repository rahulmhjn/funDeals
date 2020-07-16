const express = require("express");
const router = express.Router(),
  { upload } = require("../cloudinary"),
  { check } = require("express-validator"),
  { asyncErrorHandler, isLoggedIn, isMerchant,redirectMer,redirectAdmin } = require("../middleware"),
  { searchAndFilter } = require("../middleware/searchAndFilter"),
  {
    couponIndex,
    couponNew,
    couponCreate,
    couponShow,
    couponEdit,
    couponUpdate,
    couponDestroy,
    couponHfUpdate
  } = require("../controllers/coupon");

//@Route    GET '/coupons/'
//@desc     Show page for all the Coupons
//@access   Public
router.get(
  '/',
  redirectMer,
  redirectAdmin,
  asyncErrorHandler(searchAndFilter),
  asyncErrorHandler(couponIndex)
);

//@Route    GET '/coupons/new'
//@desc     Coupon Creation Form
//@access   Private
router.get("/new", isLoggedIn, isMerchant, couponNew);

//@Route    POST '/coupons/'
//@desc     Create the Coupon
//@access   Private
// prettier-ignore
router.post("/", upload.single("image"), isLoggedIn, isMerchant, asyncErrorHandler(couponCreate));

//@Route    GET '/coupons/:id'
//@desc     Show page for each Coupon
//@access   Private
router.get('/:id', redirectMer, redirectAdmin, asyncErrorHandler(couponShow));

//@Route    GET '/coupons/:id/edit'
//@desc     Coupon Edit Form
//@access   Private
router.get("/:id/edit", isLoggedIn, isMerchant, asyncErrorHandler(couponEdit));

//@Route    PUT '/coupons/:id'
//@desc     Coupon update
//@access   Private
// prettier-ignore
router.put("/:id", upload.single("image"), isLoggedIn, isMerchant, asyncErrorHandler(couponUpdate));

//@Route    PUT '/coupons/:id/homeField'
//@desc     Coupon update
//@access   Private
// prettier-ignore
router.put("/:id/homeField", isLoggedIn, isMerchant, asyncErrorHandler(couponHfUpdate));

//@Route    DELETE '/coupons/:id'
//@desc     Coupon Delete
//@access   Private
router.delete("/:id", isLoggedIn, isMerchant, asyncErrorHandler(couponDestroy));
module.exports = router;
