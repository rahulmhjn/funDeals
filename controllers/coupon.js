const Coupon = require('../models/coupon');
const { validationResult } = require('express-validator');
const { cloudinary } = require('../cloudinary');
const User = require('../models/user');
const Search = require('../models/search');

module.exports = {
  //Post index will show all the coupons made
  async couponIndex(req, res, next) {
    const { dbQueries } = res.locals;
    const admin = await User.find({ typeAccess: 'admin' });
    delete res.locals.dbQueries;

    //set coupon limit
    couponLimit = 6;
    if (req.query.couponSearch || req.query.homeField) {
      couponLimit = 8;
    }

    let coupons = await Coupon.paginate(dbQueries, {
      page: req.query.page || 1,
      limit: couponLimit,
      sort: '-_id'
    });

    coupons.page = Number(coupons.page);

    if (!coupons.docs.length && res.locals.query) coupons = null;

    res.render('coupons/index', { coupons, admin: admin[0], title: 'Coupons' });
  },
  //New post
  couponNew(req, res, next) {
    res.render('coupons/new', { title: 'Create New Coupon' });
  },

  async couponCreate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //image upload

    if (req.file) {
      let { secure_url, public_id } = req.file;
      secure_url = secure_url.replace(
        'upload/',
        'upload/c_scale,h_340,q_50,w_450/'
      );
      req.body.coupon.image = {
        url: secure_url,
        public_id: public_id
      };
    }
    //Create a Coupon
    req.body.coupon.author = req.user._id;
    //set keywords for the searching and filtering
    let keyWords = req.body.coupon.searchKeyWords;

    req.body.coupon.exactSearch = keyWords;

    req.body.coupon.searchKeyWords = keyWords.replace(/,/g, ' ');

    req.body.coupon.businessName = req.user.businessName;

    req.body.coupon.city = req.user.city;

    let coupon = await Coupon.create(req.body.coupon);

    req.session.success = 'Coupon Created Successfully!';
    res.redirect('/merchantDashboard/offer');
  },

  async couponShow(req, res, next) {
    var coupon = await Coupon.findById(req.params.id).populate({
      path: 'reviews',
      options: { sort: { _id: -1 } },
      populate: {
        path: 'author',
        model: 'user'
      }
    });

    var regex = new RegExp(escapeRegExp(coupon.searchKeyWords), 'gi');
    let similarCoupon = await Coupon.find({
      searchKeyWords: regex,
      quantity: { $gt: 0 },
      isApproved: true
    })
      .limit(5)
      .sort('-_id')
      .exec();

    const floorRating = coupon.averageRating();
    //remove the coupon of show page
    similarCoupon = similarCoupon.map(sCoupon => {
      if (sCoupon._id.equals(coupon._id)) return false;
      else return sCoupon;
    });
    var index = similarCoupon.indexOf(false);
    if (index > -1) {
      similarCoupon.splice(index, 1);
    }

    res.render('coupons/show', {
      coupon,
      floorRating,
      similarCoupon,
      image: coupon.image.url,
      title: coupon.offerName
    });
  },
  //let merchant = find by id().populate;
  //res.render {coupon:merchant.coupon}

  async couponEdit(req, res, next) {
    let coupon = await Coupon.findById(req.params.id);
    res.render('coupons/edit', { coupon, title: 'Edit Coupon' });
  },

  async couponUpdate(req, res, next) {
    //find the post by id
    let coupon = await Coupon.findById(req.params.id);
    //set keywords for the searching and filtering
    let keyWords = req.body.coupon.exactSearch;

    req.body.coupon.searchKeyWords = keyWords.replace(/,/g, ' ');

    //update image
    if (req.file) {
      let p_id = coupon.image.public_id;
      //delete existing image
      await cloudinary.v2.uploader.destroy(p_id);
      //upload new image
      let { secure_url, public_id } = req.file;
      coupon.image = {
        url: secure_url,
        public_id: public_id
      };
    }

    //set keywords for the searching and filtering
    /*  let keyWords = req.body.coupon.searchKeyWords;
    coupon.searchKeyWords = keyWords.replace(/,/g, ' ');
 */
    //single keyword possible
    /* coupon.filterKeyWords = req.body.coupon.filterKeyWords;
     */
    //Updating required fields
    coupon.offerDetail = req.body.coupon.offerDetail;
    coupon.offerName = req.body.coupon.offerName;
    coupon.offerAmount = req.body.coupon.offerAmount;
    coupon.offerPercentage = req.body.coupon.offerPercentage;
    coupon.offerType = req.body.coupon.offerType;
    coupon.merchantAmount = req.body.coupon.merchantAmount;
    coupon.quantity = req.body.coupon.quantity;
    coupon.couponType = req.body.coupon.couponType;
    coupon.startDate = req.body.coupon.startDate;
    coupon.expireDate = req.body.coupon.expireDate;
    coupon.startTime = req.body.coupon.startTime;
    coupon.expireTime = req.body.coupon.expireTime;
    coupon.homeField = req.body.coupon.homeField;
    coupon.exactSearch = req.body.coupon.exactSearch;
    coupon.searchKeyWords = req.body.coupon.searchKeyWords;
    await coupon.save();

    res.redirect('/adminDashboard/coupon');
  },

  async couponDestroy(req, res, next) {
    let coupon = await Coupon.findById(req.params.id);
    let { public_id } = coupon.image;
    await cloudinary.v2.uploader.destroy(public_id);
    await coupon.remove();
    res.redirect('/coupons');
  },

  async couponHfUpdate(req, res, next) {
    let coupon = await Coupon.findById(req.params.id);
    coupon.homeField = req.body.coupon.homeField;
    await coupon.save();

    res.redirect('/adminDashboard/couponType');
  }
};

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
