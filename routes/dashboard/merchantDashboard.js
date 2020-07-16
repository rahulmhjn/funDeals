const express = require("express"),
  router = express.Router(),
  { upload } = require("../../cloudinary"),
  {
    asyncErrorHandler,
    isReviewAuthor,
    isLoggedIn,
    isMerchant
  } = require("../../middleware"),
  {
    showMerchantOffer,
    showMerchantReview,
    showMerchantProfile,
    showMerchantGallery,
    GalleryUpload,
    GalleryUpdate,
    showMerchantCustomer,
    manageUsedCoupon,
    addBranch,
    deleteBranch,
    getBranch
  } = require("../../controllers/dashboard/merchantDashboard");

//@Route    GET '/merchantDashboard/offer'
//@desc     Offer Show page of Merchant
//@access   Private

router.get(
  "/offer",
  isLoggedIn,
  isMerchant,
  asyncErrorHandler(showMerchantOffer)
);

//@Route    GET '/merchantDashboard/review'
//@desc     Show Reviews on merchant profile and his coupons
//@access   Private

router.get(
  "/review",
  isLoggedIn,
  isMerchant,
  asyncErrorHandler(showMerchantReview)
);

//@Route    GET '/merchantDashboard/profile'
//@desc     Show and Update profile page
//@access   Private

router.get(
  "/profile",
  isLoggedIn,
  isMerchant,
  asyncErrorHandler(showMerchantProfile)
);

//@Route    GET '/merchantDashboard/gallery'
//@desc     Show and Update gallery page
//@access   Private

router.get(
  "/gallery",
  isLoggedIn,
  isMerchant,
  asyncErrorHandler(showMerchantGallery)
);

//@Route    POST '/merchantDashboard'
//@desc     Upload images of Gallery
//@access   Private
// prettier-ignore
router.post("/", upload.array("gallery", 10), isLoggedIn,isMerchant, asyncErrorHandler(GalleryUpload)
);

//@Route    PUT '/merchantDashboard'
//@desc     Update images of Gallery
//@access   Private
// prettier-ignore
router.put(
  '/',
  upload.array('gallery', 9),
  isLoggedIn,
  isMerchant,
  asyncErrorHandler(GalleryUpdate)
);

//@Route    GET '/merchantDashboard/customer'
//@desc     Merchant customer page
//@access   Private

router.get(
  "/customer",
  isLoggedIn,
  isMerchant,
  asyncErrorHandler(showMerchantCustomer)
);

//@Route    PUT '/merchantDashboard/:customer_id/:coupon_id'
//@desc     Manage  Used Coupon
//@access   Private

router.put(
  "/customer/:customer_id/:coupon_id",
  isLoggedIn,
  isMerchant,
  asyncErrorHandler(manageUsedCoupon)
);

//@Route    POST '/merchantDashboard/branch'
//@desc     add branches of merchant
//@access   Private
// prettier-ignore
router.post(
  '/branch',
  isLoggedIn,
  isMerchant,
  asyncErrorHandler(addBranch)
);

//@Route    DELETE '/merchantDashboard/branch/:branchId'
//@desc     delete  branches of merchant
//@access   Private
// prettier-ignore
router.delete(
  '/branch/:branchId',
  isLoggedIn,
  isMerchant,
  asyncErrorHandler(deleteBranch)
);
//@Route    GET '/merchantDashboard/branch'
//@desc     GET  branches of merchant
//@access   Private
// prettier-ignore
router.get(
  '/branch',
  isLoggedIn,
  isMerchant,
  asyncErrorHandler(getBranch)
);

module.exports = router;
