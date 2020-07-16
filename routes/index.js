const express = require('express'),
  router = express.Router(),
  { check } = require('express-validator'),
  { upload } = require('../cloudinary'),
  {
    asyncErrorHandler,
    isLoggedIn,
    isMerchant,
    isAdmin,
    redirectMer,
    redirectAdmin
  } = require('../middleware'),
  {
    home,
    showMerchant,
    myorder,
    selectCity,
    updateProfile,
    userProfile
  } = require('../controllers');

//@Route    GET '/'
//@desc     This is home page
//@access   Public

router.get('/', redirectMer, redirectAdmin, asyncErrorHandler(home));

//@Route    GET '/:city'
//@desc     To select the city
//@access   Public

router.get('/city/:city', redirectMer, redirectAdmin, selectCity);

//@Route    GET '/show-merchant/:merchant_id'
//@desc     Show the profile for the merchant
//@access   Public

router.get(
  '/show-merchant/:merchant_id',
  redirectMer,
  redirectAdmin,
  asyncErrorHandler(showMerchant)
);

//@Route    GET '/show-merchant/:merchant_id'
//@desc     Show the profile for the user
//@access   Public

router.get(
  '/user/profile',
  isLoggedIn,
  redirectMer,
  redirectAdmin,
  asyncErrorHandler(userProfile)
);

//@Route    GET '/myorder'
//@desc     Show unused coupon of coustomer
//@access   Private

router.get(
  '/myorder',
  isLoggedIn,
  redirectMer,
  redirectAdmin,
  asyncErrorHandler(myorder)
);

//@Route    PUT '/update-profile/merchant'
//@desc     Update the merchant profile
//@access   Private

router.put(
  '/update-profile/merchant',
  upload.single('logo'),
  isLoggedIn,
  asyncErrorHandler(updateProfile)
);

module.exports = router;
