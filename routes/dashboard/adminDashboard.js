const express = require('express'),
  router = express.Router(),
  { upload } = require('../../cloudinary'),
  { check } = require('express-validator'),
  {
    asyncErrorHandler,

    isLoggedIn,

    isAdmin
  } = require('../../middleware'),
  {
    showCoupons,
    approveCoupon,
    rejectCoupon,
    showMerchants,
    showCustomers,
    showSliderGallery,
    GalleryUpdate,
    GalleryUpload,
    indexAdOneUpload,
    indexAdOneUpdate,
    indexAdOneLink,
    indexSliderTwoUpload,
    indexSliderTwoUpdate,
    indexSliderTwoLink,
    indexAdTwoUpload,
    indexAdTwoUpdate,
    indexAdTwoLink,
    indexSliderThreeUpload,
    indexSliderThreeUpdate,
    indexSliderThreeLink,
    couponPageAdUpdate,
    couponPageAdUpload,
    couponPageAdLink,
    cartAdUpload,
    cartAdUpdate,
    addState,
    addCity,
    addArea,
    getSettings,
    showAdminMerchant,
    showBenefits,
    updateQuotes,
    updateHdBenefits,
    showCouponList,
    showCouponType,
    merchantPay,
    merchantUnPay,
    analytics,
    showSliderGalleryLink,
    showSpecialSignup,
    specialSignup,
    getHd,
    postHd
  } = require('../../controllers/dashboard/adminDashboard');

//@Route    GET '/adminDashboard/coupon'
//@desc     Show all coupons info (pending,approve,rejected)
//@access   Private

router.get('/coupon', isLoggedIn, isAdmin, asyncErrorHandler(showCoupons));

//@Route    GET '/adminDashboard/couponType'
//@desc     Show all coupons info (pending,approve,rejected)
//@access   Private

router.get(
  '/couponType',
  isLoggedIn,
  isAdmin,
  asyncErrorHandler(showCouponType)
);

//@Route    PUT '/adminDashboard/:coupon_id/coupon'
//@desc     Approve Coupon
//@access   Private

router.put(
  '/:coupon_id/approve',
  isLoggedIn,
  isAdmin,
  asyncErrorHandler(approveCoupon)
);

//@Route    PUT '/adminDashboard/:coupon_id/coupon'
//@desc     Approve Coupon
//@access   Private

router.put(
  '/:coupon_id/reject',
  isLoggedIn,
  isAdmin,
  asyncErrorHandler(rejectCoupon)
);

//@Route    GET '/adminDashboard/review'
//@desc     Show Reviews on merchant profile and his coupons
//@access   Private

router.get('/merchant', isLoggedIn, isAdmin, asyncErrorHandler(showMerchants));

//@Route    GET '/adminDashboard/customer'
//@desc     Show Reviews on merchant profile and his coupons
//@access   Private

router.get('/customer', isLoggedIn, isAdmin, asyncErrorHandler(showCustomers));

//@Route    GET '/adminDashboard/gallery'
//@desc     Show and Update gallery page
//@access   Private

router.get(
  '/gallery',
  isLoggedIn,
  isAdmin,
  asyncErrorHandler(showSliderGallery)
);
//@Route    PUT '/adminDashboard/gallery/:public_id'
//@desc     Show and Update gallery page
//@access   Private

router.put(
  '/gallery/happiness/:public_id',
  isLoggedIn,
  isAdmin,
  asyncErrorHandler(showSliderGalleryLink)
);

//@Route    POST '/adminDashboard'
//@desc     Upload images of Gallery
//@access   Private
// prettier-ignore
router.post("/", upload.array("gallery", 9),isLoggedIn,isAdmin,asyncErrorHandler(GalleryUpload)
);

//@Route    PUT '/adminDashboard'
//@desc     Update images of Gallery
//@access   Private
// prettier-ignore
router.put("/",upload.array("gallery",9),isLoggedIn,isAdmin,asyncErrorHandler(GalleryUpdate));

//this is index ad  one
//@Route    POST '/adminDashboard/indexAdOne'
//@desc     Upload images of index Ad one
//@access   Private
// prettier-ignore
router.post("/indexAdOne", upload.array("indexAdOne",3),isLoggedIn,isAdmin,asyncErrorHandler(indexAdOneUpload)
);

//@Route    PUT '/adminDashboard/indexAdOne/:public_id'
//@desc     upload and update the link of gallery
//@access   Private

router.put(
  '/indexAdOne/happiness/:public_id',
  isLoggedIn,
  isAdmin,
  asyncErrorHandler(indexAdOneLink)
);

//@Route    PUT '/adminDashboard/indexAdOne'
//@desc     Update images of index Ad one
//@access   Private
// prettier-ignore
router.put("/indexAdOne",upload.array("indexAdOne",3),isLoggedIn,isAdmin,asyncErrorHandler(indexAdOneUpdate));

//this is slider two
//@Route    POST '/adminDashboard/indexSliderTwo'
//@desc     Upload images of Index Slider 2
//@access   Private
// prettier-ignore
router.post("/indexSliderTwo", upload.array("indexSliderTwo",3),isLoggedIn,isAdmin,asyncErrorHandler(indexSliderTwoUpload)
);

//@Route    PUT '/adminDashboard/indexSliderTwo/:public_id'
//@desc     upload and update the link of gallery
//@access   Private

router.put(
  '/indexSliderTwo/happiness/:public_id',
  isLoggedIn,
  isAdmin,
  asyncErrorHandler(indexSliderTwoLink)
);
//@Route    PUT '/adminDashboard/indexSliderTwo'
//@desc     Update images of Index Slider 2
//@access   Private
// prettier-ignore
router.put("/indexSliderTwo",upload.array("indexSliderTwo",3),isLoggedIn,isAdmin,asyncErrorHandler(indexSliderTwoUpdate));

//this is index ad  Two
//@Route    POST '/adminDashboard/indexAdOne'
//@desc     Upload images of index Ad two
//@access   Private
// prettier-ignore
router.post("/indexAdTwo", upload.array("indexAdTwo",5),isLoggedIn,isAdmin,asyncErrorHandler(indexAdTwoUpload)
);
//@Route    PUT '/adminDashboard/indexAdTwo/:public_id'
//@desc     upload and update the link of gallery
//@access   Private

router.put(
  '/indexAdTwo/happiness/:public_id',
  isLoggedIn,
  isAdmin,
  asyncErrorHandler(indexAdTwoLink)
);
//@Route    PUT '/adminDashboard/indexAdTwo'
//@desc     Update images of index Ad two
//@access   Private
// prettier-ignore
router.put("/indexAdTwo",upload.array("indexAdTwo",5),isLoggedIn,isAdmin,asyncErrorHandler(indexAdTwoUpdate));

//this is indexSliderThree
//@Route    POST '/adminDashboard/indexSliderThree'
//@desc     Upload images of indexSliderThree
//@access   Private
// prettier-ignore
router.post("/indexSliderThree", upload.array("indexSliderThree",3),isLoggedIn,isAdmin,asyncErrorHandler(indexSliderThreeUpload)
);

//@Route    PUT '/adminDashboard/indexSliderThree/:public_id'
//@desc     upload and update the link of gallery
//@access   Private

router.put(
  '/indexSliderThree/happiness/:public_id',
  isLoggedIn,
  isAdmin,
  asyncErrorHandler(indexSliderThreeLink)
);
//@Route    PUT '/adminDashboard/indexSliderThree'
//@desc     Update images of indexSliderThree
//@access   Private
// prettier-ignore
router.put("/indexSliderThree",upload.array("indexSliderThree",3),isLoggedIn,isAdmin,asyncErrorHandler(indexSliderThreeUpdate));

//this is couponPageAd
//@Route    POST '/adminDashboard/couponPageAd'
//@desc     Upload images of couponPageAd
//@access   Private
// prettier-ignore
router.post("/couponPageAd", upload.array("couponPageAd",2),isLoggedIn,isAdmin,asyncErrorHandler(couponPageAdUpload)
);

//@Route    PUT '/adminDashboard/couponPageAd/:public_id'
//@desc     upload and update the link of gallery
//@access   Private

router.put(
  '/couponPageAd/happiness/:public_id',
  isLoggedIn,
  isAdmin,
  asyncErrorHandler(couponPageAdLink)
);
//@Route    PUT '/adminDashboard/couponPageAd'
//@desc     Update images of couponPageAd
//@access   Private
// prettier-ignore
router.put("/couponPageAd",upload.array("couponPageAd",2),isLoggedIn,isAdmin,asyncErrorHandler(couponPageAdUpdate));

//this is cartAd
//@Route    POST '/adminDashboard/cartAd'
//@desc     Upload images of cartAd
//@access   Private
// prettier-ignore
router.post("/cartAd", upload.array("cartAd",2),isLoggedIn,isAdmin,asyncErrorHandler(cartAdUpload)
);

//@Route    PUT '/adminDashboard/cartAd'
//@desc     Update images of cartAd
//@access   Private
// prettier-ignore
router.put("/cartAd",upload.array("cartAd",2),isLoggedIn,isAdmin,asyncErrorHandler(cartAdUpdate));

//@Route    Post 'adminDashboard/state/new'
//@desc     add new state nad city
//@access   Private

router.post(
  '/state/new',
  isLoggedIn,
  isAdmin,
  check('city', 'city is required').exists(),
  check('state', 'state is required').exists(),
  asyncErrorHandler(addState)
);

//@Route    Post '/adminDashboard/city/new'
//@desc     add city of existing state
//@access   Private

router.post(
  '/city/new',
  isLoggedIn,
  isAdmin,
  check('city', 'city is required').exists(),
  check('state', 'state is required').exists(),
  asyncErrorHandler(addCity)
);

//@Route    Post '/adminDashboard/area/new'
//@desc     add area of existing city and state
//@access   Private

router.post(
  '/area/new',
  isLoggedIn,
  isAdmin,
  check('city', 'city is required').exists(),
  check('state', 'state is required').exists(),
  check('area', 'area is required').exists(),
  asyncErrorHandler(addArea)
);

//@Route    GET '/adminDashboard/setting'
//@desc     add state, city and state
//@access   Private

router.get('/setting', isLoggedIn, isAdmin, asyncErrorHandler(getSettings));

//@Route    GET '/adminDashboard/showAdminMerchant/:merchant_id'
//@desc     show the merchant details
//@access   Private
// prettier-ignore
router.get(
  '/showAdminMerchant/:merchant_id',
  isLoggedIn,
  isAdmin,
  asyncErrorHandler(showAdminMerchant)
);

//@Route    GET '/adminDashboard/benefits'
//@desc     show Benefits details
//@access   Private
// prettier-ignore
router.get("/benefits",isLoggedIn,isAdmin, asyncErrorHandler(showBenefits));

//@Route    PUT '/adminDashboard/benefits'
//@desc     show the merchant details
//@access   Private
// prettier-ignore
router.put("/benefits",isLoggedIn,isAdmin, asyncErrorHandler(updateHdBenefits));

//@Route    GET '/adminDashboard/couponList'
//@desc     show the details of coupons
//@access   Private
// prettier-ignore
router.get("/couponList",isLoggedIn,isAdmin, asyncErrorHandler(showCouponList));

//@Route    PUT '/adminDashboard/quotes'
//@desc     Change and Add some new stuff
//@access   Private
// prettier-ignore
router.put("/quotes",isLoggedIn,isAdmin, asyncErrorHandler(updateQuotes));

//@Route    PUT  '/adminDashboard/merchant-payment/:merchant_id'
//@desc     get the payment
//@access   Private

router.put(
  '/merchant-payment/:merchant_id',
  isLoggedIn,
  isAdmin,
  asyncErrorHandler(merchantPay)
);

//@Route    PUT  '/adminDashboard/merchant-un-payment/:merchant_id'
//@desc     get the payment
//@access   Private

router.put(
  '/merchant-un-payment/:merchant_id',
  isLoggedIn,
  isAdmin,
  asyncErrorHandler(merchantUnPay)
);

//@Route    GET  '/adminDashboard/analytics '
//@desc     get the payment
//@access   Private

router.get('/analytics', isLoggedIn, isAdmin, asyncErrorHandler(analytics));

//@Route    PUT  '/adminDashboard/specialSignup'
//@desc     update the no. of coupons and hdPoints for specialSignup
//@access   Private

router.put(
  '/specialSignup',
  [
    check('hdPoints', 'Enter the hdPoints').exists(),
    check('coupons', 'Enter atLeast one Coupon').exists()
  ],
  // isLoggedIn,
  // isAdmin,
  asyncErrorHandler(specialSignup)
);

//@Route    GET  '/adminDashboard/specialSignup'
//@desc     show all the coupon details
//@access   Private

router.get(
  '/specialSignup',

  // isLoggedIn,
  // isAdmin,
  asyncErrorHandler(showSpecialSignup)
);

//@Route    GET  '/adminDashboard/hd'
//@desc     hd points
//@access   Private

router.get(
  '/hd',

  isLoggedIn,
  isAdmin,
  asyncErrorHandler(getHd)
);

//@Route    POST  '/adminDashboard/hd'
//@desc     hd points
//@access   Private

router.post(
  '/hd',

  isLoggedIn,
  isAdmin,
  asyncErrorHandler(postHd)
);
module.exports = router;
