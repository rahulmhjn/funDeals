const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  asyncErrorHandler,
  isReviewAuthor,
  isLoggedIn
} = require("../middleware");
const {
  reviewCreate,
  reviewDestroy,
  reviewUpdate
} = require("../controllers/review");

//@Route    POST '/coupons/:id/reviews'
//@desc     Create Review for a coupon
//@access   Public
router.post("/", isLoggedIn, asyncErrorHandler(reviewCreate));

//@Route    PUT '/coupons/:id/reviews/:review_id'
//@desc     Updates the review
//@access   Public
router.put("/:review_id", isReviewAuthor, (req, res, next) => {
  res.send("update/reviews/:review_id");
});

//@Route    DELETE '/coupons/:id/reviews/review_id'
//@desc     Delete the review
//@access   Public
router.delete("/:review_id", isReviewAuthor, asyncErrorHandler(reviewDestroy));
module.exports = router;
