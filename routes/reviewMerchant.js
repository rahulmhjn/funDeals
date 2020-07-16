const express = require('express'),
  router = express.Router(),
  { asyncErrorHandler, isReviewAuthor, isLoggedIn } = require('../middleware'),
  {
    createMerchantReview,
    deleteMerchantReview
  } = require('../controllers/reviewMerchant');

//@Route    post '/show-merchant/:merchant_id/review'
//@desc     Create Review for a Merchant
//@access   Private

router.post(
  '/:merchant_id/review',
  isLoggedIn,
  asyncErrorHandler(createMerchantReview)
);

//@Route    DELETE '/show-merchant/:merchant_id/review/:review_id'
//@desc     Delete Review of the Merchant
//@access   Private

router.delete(
  '/:merchant_id/review/:review_id',
  isLoggedIn,
  isReviewAuthor,
  asyncErrorHandler(deleteMerchantReview)
);

module.exports = router;
