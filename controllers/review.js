const Coupon = require("../models/coupon");
const Review = require("../models/review");

module.exports = {
  //Reviews Create
  async reviewCreate(req, res, next) {
    //find the post by its id
    let coupon = await Coupon.findById(req.params.id);
    //create review
    req.body.review.author = req.user._id;
    req.body.review.coupon = req.params.id;
    let review = await Review.create(req.body.review);
    //assign review to post
    coupon.reviews.unshift(review);
    //save the post
    await coupon.save();
    //redirect to the post
    req.session.success = "Review created successfully";
    res.redirect(`/coupons/${coupon.id}`);
  },

  //Reviews Update
  async reviewUpdate(req, res, next) {},

  //Reviews Destroy
  async reviewDestroy(req, res, next) {
    await Coupon.findByIdAndUpdate(req.params.id, {
      $pull: { reviews: req.params.review_id }
    });
    await Review.findByIdAndRemove(req.params.review_id);
    req.session.success = "Review deleted successfully!";
    res.redirect(`/coupons/${req.params.id}`);
  }
};
