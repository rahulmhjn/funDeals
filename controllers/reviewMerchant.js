const Review = require('../models/review');
module.exports = {
  async createMerchantReview(req, res, next) {
    const review = {
      author: req.user.id,
      merchant: req.params.merchant_id,
      body: req.body['body'],
      rating: req.body.rating
    };
    await Review.create(review);
    res.redirect(`/show-merchant/${req.params.merchant_id}`);
  },

  async deleteMerchantReview(req, res, next) {
    await Review.findByIdAndDelete(req.params.review_id);
    res.redirect(`/show-merchant/${req.params.merchant_id}`);
  }
};
