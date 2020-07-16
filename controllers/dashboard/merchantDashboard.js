const Review = require("../../models/review");
const Coupon = require("../../models/coupon");
const User = require("../../models/user");
const Branch = require("../../models/branch");
const { cloudinary } = require("../../cloudinary");
const { customerUsedCouponEmail } = require("../../nodemailer");
module.exports = {
  async showMerchantOffer(req, res, next) {
    const merchantCoupons = await Coupon.find({
      author: req.user._id,
      
      expireDate: { $gt: Date.now() }
    });
    res.render("merchants/offer", { merchantCoupons, title: "offer" });
  },

  async showMerchantReview(req, res, next) {
    const merchant = await User.findById(req.user._id);
    const merchantReviews = await Review.find({
      merchant: req.user._id
    }).populate({
      path: "author",
      model: "user"
    });

    merchantFloorRating = 0;

    if (merchantReviews.length) {
      merchantReviews.forEach(review => {
        merchantFloorRating += review.rating;
      });
    }

    merchantFloorRating = merchant.averageRating(
      merchantReviews.length,
      merchantFloorRating
    );

    const coupons = await Coupon.find({
      author: req.user._id
    }).populate({
      path: "reviews",
      options: { sort: { _id: -1 } },
      populate: {
        path: "author",
        model: "user"
      }
    });

    //coupon review avg rating

    var couponAvgRating = 0;
    var reviewLength = 0;

    coupons.forEach(function(coupon) {
      coupon.reviews.forEach(function(review) {
        if (review.rating) {
          couponAvgRating += review.rating;
          reviewLength++;
        }
      });
    });
    if (reviewLength) {
      couponAvgRating = couponAvgRating / reviewLength;
    }

    var couponFloorRating = Math.floor(couponAvgRating);

    res.render("merchants/review", {
      merchantReviews,
      coupons,
      title: "review",
      merchantFloorRating,
      couponFloorRating,
      couponAvgRating
    });
  },

  async showMerchantProfile(req, res, next) {
    const merchant = await User.findById(req.user._id);
    const branch = await Branch.find({ author: req.user._id });
    res.render("merchants/profile", { merchant, title: "profile", branch });
  },

  async showMerchantGallery(req, res, next) {
    const merchant = await User.findById(req.user._id);
    res.render("merchants/gallery", { merchant, title: "Gallery" });
  },

  async GalleryUpload(req, res, next) {
    const merchant = await User.findById(req.user._id);
    /*cloudinary new image upload*/
    // prettier-ignore
    for(const file of req.files){
      let image_url = file.secure_url.replace(
        'upload/',
        'upload/c_scale,h_360,q_50,w_450/'
      );
    	merchant.gallery.push({url:image_url,public_id:file.public_id});
    }
    await merchant.save();
    res.redirect(`/merchantDashboard/gallery`);
  },

  async GalleryUpdate(req, res, next) {
    const merchant = await User.findById(req.user._id);
   
    /*cloudinary image update*/
    if (req.body.deleteCheckbox && req.body.deleteCheckbox.length) {
      for (public_id of req.body.deleteCheckbox) {
        await cloudinary.v2.uploader.destroy(public_id);
        merchant.gallery = merchant.gallery.filter(
          image => image.public_id !== public_id
        );
      }
    }
    // prettier-ignore
    if (req.files) {
      for (const file of req.files) {
        let image_url = file.secure_url.replace(
          'upload/',
          'upload/c_scale,h_360,q_30,w_450/'
        );
        merchant.gallery.push({ url: image_url, public_id: file.public_id });
      }
    }

    await merchant.save();
    res.redirect(`/merchantDashboard/gallery`);
  },

  async showMerchantCustomer(req, res, next) {
    const merchant = await User.findById(req.user._id);
    const coupons = await Coupon.find({
      author: req.user._id
    });
    res.render("merchants/customer", { coupons });
  },

  async manageUsedCoupon(req, res, next) {
    const customer = await User.findById(req.params.customer_id);
    const coupon = await Coupon.findById(req.params.coupon_id);

    const customer_id = req.params.customer_id;
    const coupon_id = req.params.coupon_id;

    //send Email
    await customerUsedCouponEmail(customer.email, coupon.offerName);

    //coupon
    coupon.unusedCouponCustomer[customer_id].qty -= 1;
    if (!coupon.usedCouponCustomer) {
      coupon.usedCouponCustomer = {};
    }
    let coupondata = coupon.usedCouponCustomer[customer_id];

    if (!coupondata) {
      coupon.usedCouponCustomer[customer_id] = {
        qty: 1,
        code: coupon.unusedCouponCustomer[customer_id].code,
        date: coupon.unusedCouponCustomer[customer_id].date,
        username: coupon.unusedCouponCustomer[customer_id].username,
        email: coupon.unusedCouponCustomer[customer_id].email,
        number: coupon.unusedCouponCustomer[customer_id].number,
        usedDate: new Date(),
        author: coupon.unusedCouponCustomer[customer_id].couponAuthor
      };
    } else {
      coupon.usedCouponCustomer[customer_id].qty += 1;
      console.log(coupon.usedCouponCustomer[customer_id].qty);
    }

    if (coupon.unusedCouponCustomer[customer_id].qty <= 0) {
      delete coupon.unusedCouponCustomer[customer_id];
    }
    coupon.markModified("unusedCouponCustomer");
    coupon.markModified("usedCouponCustomer");
    await coupon.save();
    //customer
    customer.unusedCoupon[coupon_id].qty -= 1;
    if (!customer.usedCoupon) {
      customer.usedCoupon = {};
    }
    const customerdata = customer.usedCoupon[coupon_id];

    if (!customerdata) {
      customer.usedCoupon[coupon_id] = {
        qty: 1,
        code: customer.unusedCoupon[coupon_id].code,
        author: customer.unusedCoupon[coupon_id].couponAuthor,
        usedDate: new Date()
      };
    } else {
      customer.usedCoupon[coupon_id].qty += 1;
    }

    if (customer.unusedCoupon[coupon_id].qty <= 0) {
      delete customer.unusedCoupon[coupon_id];
    }

    customer.markModified("unusedCoupon");
    customer.markModified("usedCoupon");
    await customer.save();

    res.redirect("/merchantDashboard/customer");
  },

  async addBranch(req, res, next) {
    req.body.author = req.user._id;
    await Branch.create(req.body);
    return res.redirect("back");
  },
  async deleteBranch(req, res, next) {
    const { branchId } = req.params;
    await Branch.findByIdAndDelete(branchId);
    return res.redirect("back");
  },

  async getBranch(req, res, next) {
    const branch = await Branch.find({ author: req.user._id });
    return res.render("merchants/branch", { branch });
  }
};
