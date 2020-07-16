const Review = require('../../models/review');
const Coupon = require('../../models/coupon');
const User = require('../../models/user');
const { cloudinary } = require('../../cloudinary');
const { dealAcceptedEmail, dealRejectedEmail } = require('../../nodemailer');
const Search = require('../../models/search');
const State = require('../../models/state');
const { validationResult } = require('express-validator');
const SpecialSignup = require('../../models/specialSignup');

module.exports = {
  async showCoupons(req, res, next) {
    const coupons = await Coupon.find({
      expireDate: { $gt: Date.now() }
    });
    res.render('admin/coupon', { coupons, title: 'Coupons' });
  },
  async showCouponType(req, res, next) {
    const coupons = await Coupon.find({
      expireDate: { $gt: Date.now() },
      isApproved: true
    });
    res.render('admin/couponType', { coupons, title: 'CouponType' });
  },

  async approveCoupon(req, res, next) {
    const coupon = await Coupon.findById(req.params.coupon_id).populate({
      path: 'author'
    });

    await dealAcceptedEmail(coupon.author.email, coupon.offerName);

    //find search model for search suggestions
    const searchSuggestion = await Search.findOne({ identifier: 'search' });
    set = new Set(searchSuggestion.search);
    arr = coupon.exactSearch.split(',');
    arr.forEach(arr => {
      set.add(arr);
    });
    arr = [...set];
    searchSuggestion.search = arr;
    //for filters
    const offerType = coupon.offerType;
    filterSet = new Set(searchSuggestion[offerType]);

    filterArr = coupon.exactSearch.split(',');

    filterArr.forEach(arr => {
      filterSet.add(arr);
    });

    filterArr = [...filterSet];
    searchSuggestion[offerType] = filterArr;

    await searchSuggestion.save();

    //end
    coupon.isPending = false;
    coupon.isRejected = false;
    coupon.isApproved = true;
    coupon.approveDate = Date.now();
    coupon.homeField = req.body.homeField;
    coupon.adminAmount = req.body.adminAmount;
    await coupon.save();
    res.redirect('/adminDashboard/coupon');
  },

  async rejectCoupon(req, res, next) {
    const coupon = await Coupon.findById(req.params.coupon_id).populate({
      path: 'author'
    });

    await dealRejectedEmail(coupon.author.email, coupon.offerName);
    coupon.isPending = false;
    coupon.isRejected = true;
    coupon.isApproved = false;
    await coupon.save();
    res.redirect('/adminDashboard/coupon');
  },

  async showMerchants(req, res, next) {
    if (req.query.merchantName) {
      var regex = new RegExp(escapeRegExp(req.query.merchantName), 'gi');

      const paid = await User.find({ hasPaid: true, businessName: regex });
      const nonPaid = await User.find({ hasPaid: false, businessName: regex });
      res.render('admin/merchant', { paid, nonPaid, title: 'merchantDetail' });
    } else {
      const paid = await User.find({ typeAccess: 'merchant', hasPaid: true });
      const nonPaid = await User.find({
        typeAccess: 'merchant',
        hasPaid: false
      });
      res.render('admin/merchant', { paid, nonPaid, title: 'merchantDetail' });
    }
  },

  async showCustomers(req, res, next) {
    const users = await User.find({ typeAccess: 'user' });
    const coupons = await Coupon.find();
    res.render('admin/customer', { users, coupons, title: 'customerDetail' });
  },

  //slider images
  async showSliderGallery(req, res, next) {
    const admin = await User.findById(req.user._id);
    res.render('admin/gallery', { admin, title: ' sliderGallery' });
  },

  async GalleryUpload(req, res, next) {
    const admin = await User.findById(req.user._id);
    /*cloudinary new image upload*/
    // prettier-ignore
    for(const file of req.files){
      	admin.gallery.push({url:file.secure_url,public_id:file.public_id});
      }
    await admin.save();
    res.redirect(`/adminDashboard/gallery`);
  },
  async showSliderGalleryLink(req, res, next) {
    const admin = await User.findOne({ typeAccess: 'admin' });
    admin.gallery.forEach((image, index) => {
      console.log(index);
      console.log(image.public_id);
      console.log(`/happiness/${req.params.public_id}`);
      if (image.public_id == `happiness/${req.params.public_id}`) {
        admin.gallery[index].link = req.body.link;
        console.log(admin.gallery);
      }
    });
    await admin.save();
    res.redirect('/adminDashboard/gallery');
  },

  async GalleryUpdate(req, res, next) {
    const admin = await User.findById(req.user._id);

    /*cloudinary image update*/
    if (req.body.deleteCheckbox && req.body.deleteCheckbox.length) {
      for (public_id of req.body.deleteCheckbox) {
        await cloudinary.v2.uploader.destroy(public_id);
        admin.gallery = admin.gallery.filter(
          image => image.public_id !== public_id
        );
      }
    }
    // prettier-ignore
    if (req.files) {
        for (const file of req.files) {
          admin.gallery.push({ url: file.secure_url, public_id: file.public_id });
        }
      }

    await admin.save();
    res.redirect(`/adminDashboard/gallery`);
  },

  async indexAdOneUpload(req, res, next) {
    const admin = await User.findById(req.user._id);
    /*cloudinary new image upload*/
    // prettier-ignore
    for(const file of req.files){
      	admin.indexAdOne.push({url:file.secure_url,public_id:file.public_id});
      }
    await admin.save();
    res.redirect(`/adminDashboard/gallery`);
  },
  async indexAdOneLink(req, res, next) {
    const admin = await User.findOne({ typeAccess: 'admin' });
    admin.indexAdOne.forEach((image, index) => {
      if (image.public_id == `happiness/${req.params.public_id}`) {
        admin.indexAdOne[index].link = req.body.link;
      }
    });
    await admin.save();
    res.redirect('/adminDashboard/gallery');
  },
  async indexAdOneUpdate(req, res, next) {
    const admin = await User.findById(req.user._id);

    /*cloudinary image update*/
    if (req.body.deleteCheckbox && req.body.deleteCheckbox.length) {
      for (public_id of req.body.deleteCheckbox) {
        await cloudinary.v2.uploader.destroy(public_id);
        admin.indexAdOne = admin.indexAdOne.filter(
          image => image.public_id !== public_id
        );
      }
    }
    // prettier-ignore
    if (req.files) {
        for (const file of req.files) {
          admin.indexAdOne.push({ url: file.secure_url, public_id: file.public_id });
        }
      }

    await admin.save();
    res.redirect(`/adminDashboard/gallery`);
  },

  //=======================Slider Two============================

  async indexSliderTwoUpload(req, res, next) {
    const admin = await User.findById(req.user._id);
    /*cloudinary new image upload*/
    // prettier-ignore
    for(const file of req.files){
      	admin.indexSliderTwo.push({url:file.secure_url,public_id:file.public_id});
      }
    await admin.save();
    res.redirect(`/adminDashboard/gallery`);
  },
  async indexSliderTwoLink(req, res, next) {
    const admin = await User.findOne({ typeAccess: 'admin' });
    admin.indexSliderTwo.forEach((image, index) => {
      if (image.public_id == `happiness/${req.params.public_id}`) {
        admin.indexSliderTwo[index].link = req.body.link;
      }
    });
    await admin.save();
    res.redirect('/adminDashboard/gallery');
  },
  async indexSliderTwoUpdate(req, res, next) {
    const admin = await User.findById(req.user._id);

    /*cloudinary image update*/
    if (req.body.deleteCheckbox && req.body.deleteCheckbox.length) {
      for (public_id of req.body.deleteCheckbox) {
        await cloudinary.v2.uploader.destroy(public_id);
        admin.indexSliderTwo = admin.indexSliderTwo.filter(
          image => image.public_id !== public_id
        );
      }
    }
    // prettier-ignore
    if (req.files) {
        for (const file of req.files) {
          admin.indexSliderTwo.push({ url: file.secure_url, public_id: file.public_id });
        }
      }

    await admin.save();
    res.redirect(`/adminDashboard/gallery`);
  },

  //=======================Index Ad Two============================

  async indexAdTwoUpload(req, res, next) {
    const admin = await User.findById(req.user._id);
    /*cloudinary new image upload*/
    // prettier-ignore
    for(const file of req.files){
      	admin.indexAdTwo.push({url:file.secure_url,public_id:file.public_id});
      }
    await admin.save();
    res.redirect(`/adminDashboard/gallery`);
  },
  async indexAdTwoLink(req, res, next) {
    const admin = await User.findOne({ typeAccess: 'admin' });
    admin.indexAdTwo.forEach((image, index) => {
      if (image.public_id == `happiness/${req.params.public_id}`) {
        admin.indexAdTwo[index].link = req.body.link;
      }
    });
    await admin.save();
    res.redirect('/adminDashboard/gallery');
  },
  async indexAdTwoUpdate(req, res, next) {
    const admin = await User.findById(req.user._id);

    /*cloudinary image update*/
    if (req.body.deleteCheckbox && req.body.deleteCheckbox.length) {
      for (public_id of req.body.deleteCheckbox) {
        await cloudinary.v2.uploader.destroy(public_id);
        admin.indexAdTwo = admin.indexAdTwo.filter(
          image => image.public_id !== public_id
        );
      }
    }
    // prettier-ignore
    if (req.files) {
        for (const file of req.files) {
          admin.indexAdTwo.push({ url: file.secure_url, public_id: file.public_id });
        }
      }

    await admin.save();
    res.redirect(`/adminDashboard/gallery`);
  },

  //=======================Slider Three============================

  async indexSliderThreeUpload(req, res, next) {
    const admin = await User.findById(req.user._id);
    /*cloudinary new image upload*/
    // prettier-ignore
    for(const file of req.files){
      	admin.indexSliderThree.push({url:file.secure_url,public_id:file.public_id});
      }
    await admin.save();
    res.redirect(`/adminDashboard/gallery`);
  },
  async indexSliderThreeLink(req, res, next) {
    const admin = await User.findOne({ typeAccess: 'admin' });
    admin.indexSliderThree.forEach((image, index) => {
      if (image.public_id == `happiness/${req.params.public_id}`) {
        admin.indexSliderThree[index].link = req.body.link;
      }
    });
    await admin.save();
    res.redirect('/adminDashboard/gallery');
  },
  async indexSliderThreeUpdate(req, res, next) {
    const admin = await User.findById(req.user._id);

    /*cloudinary image update*/
    if (req.body.deleteCheckbox && req.body.deleteCheckbox.length) {
      for (public_id of req.body.deleteCheckbox) {
        await cloudinary.v2.uploader.destroy(public_id);
        admin.indexSliderThree = admin.indexSliderThree.filter(
          image => image.public_id !== public_id
        );
      }
    }
    // prettier-ignore
    if (req.files) {
        for (const file of req.files) {
          admin.indexSliderThree.push({ url: file.secure_url, public_id: file.public_id });
        }
      }

    await admin.save();
    res.redirect(`/adminDashboard/gallery`);
  },

  //======================= Coupon Page AD============================

  async couponPageAdUpload(req, res, next) {
    const admin = await User.findById(req.user._id);
    /*cloudinary new image upload*/
    // prettier-ignore
    for(const file of req.files){
      	admin.couponPageAd.push({url:file.secure_url,public_id:file.public_id});
      }
    await admin.save();
    res.redirect(`/adminDashboard/gallery`);
  },
  async couponPageAdLink(req, res, next) {
    const admin = await User.findOne({ typeAccess: 'admin' });
    admin.couponPageAd.forEach((image, index) => {
      if (image.public_id == `happiness/${req.params.public_id}`) {
        admin.couponPageAd[index].link = req.body.link;
      }
    });
    await admin.save();
    res.redirect('/adminDashboard/gallery');
  },
  async couponPageAdUpdate(req, res, next) {
    const admin = await User.findById(req.user._id);

    /*cloudinary image update*/
    if (req.body.deleteCheckbox && req.body.deleteCheckbox.length) {
      for (public_id of req.body.deleteCheckbox) {
        await cloudinary.v2.uploader.destroy(public_id);
        admin.couponPageAd = admin.couponPageAd.filter(
          image => image.public_id !== public_id
        );
      }
    }
    // prettier-ignore
    if (req.files) {
        for (const file of req.files) {
          admin.couponPageAd.push({ url: file.secure_url, public_id: file.public_id });
        }
      }

    await admin.save();
    res.redirect(`/adminDashboard/gallery`);
  },

  //======================= Cart AD============================

  async cartAdUpload(req, res, next) {
    const admin = await User.findById(req.user._id);
    /*cloudinary new image upload*/
    // prettier-ignore
    for(const file of req.files){
      	admin.cartAd.push({url:file.secure_url,public_id:file.public_id});
      }
    await admin.save();
    res.redirect(`/adminDashboard/gallery`);
  },

  async cartAdUpdate(req, res, next) {
    const admin = await User.findById(req.user._id);

    /*cloudinary image update*/
    if (req.body.deleteCheckbox && req.body.deleteCheckbox.length) {
      for (public_id of req.body.deleteCheckbox) {
        await cloudinary.v2.uploader.destroy(public_id);
        admin.cartAd = admin.cartAd.filter(
          image => image.public_id !== public_id
        );
      }
    }
    // prettier-ignore
    if (req.files) {
        for (const file of req.files) {
          admin.cartAd.push({ url: file.secure_url, public_id: file.public_id });
        }
      }

    await admin.save();
    res.redirect(`/adminDashboard/gallery`);
  },

  async addState(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const state = await State.findOne({ identifier: 'state' });
    const newState = req.body.state;
    const newCity = req.body.city;
    if (state.model[newState]) {
      req.session.error = `${newState} already exists!!`;
      return res.redirect('back');
    }

    state.model[newState] = {};
    state.model[newState][newCity] = [];
    state.markModified('model');
    await state.save();
    req.session.success = `${newState} state and ${newCity} city added successfully!!`;
    return res.redirect('back');
  },

  async addCity(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const state = await State.findOne({ identifier: 'state' });
    const newCity = req.body.city;
    const existingState = req.body.state;

    if (state.model[existingState][newCity]) {
      req.session.error = `${newCity} already exists!!`;
      return res.redirect('back');
    }

    //add new city of existing state
    state.model[existingState][newCity] = [];
    state.markModified('model');
    await state.save();
    req.session.success = `${newCity} city added successfully!!`;
    return res.redirect('back');
  },

  async addArea(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const state = await State.findOne({ identifier: 'state' });
    const existingCity = req.body.city;
    const existingState = req.body.state;
    const newArea = req.body.area;

    if (state.model[existingState][existingCity].includes(newArea)) {
      req.session.error = `${newArea} already exists!!`;
      return res.redirect('back');
    }
    state.model[existingState][existingCity].push(newArea);
    state.markModified('model');
    await state.save();
    req.session.success = `${newArea} area added successfully!!`;
    return res.redirect('back');
  },
  async setting(req, res, next) {
    const admin = await User.findOne({ typeAccess: 'admin' });
    res.render('admin/setting', { admin });
  },

  async showAdminMerchant(req, res, next) {
    const merchant = await User.findById(req.params.merchant_id);
    const reviews = await Review.find({ merchant: req.params.merchant_id })
      .populate({ path: 'author' })
      .sort('-_id')
      .exec();
    floorRating = 0;

    if (reviews.length) {
      reviews.forEach(review => {
        floorRating += review.rating;
      });
    }

    floorRating = merchant.averageRating(reviews.length, floorRating);

    const merchantCoupon = await Coupon.find({
      author: req.params.merchant_id
    });

    res.render('admin/showAdminMerchant.ejs', {
      merchant,
      reviews,
      merchantCoupon,
      floorRating
    });
  },
  async showBenefits(req, res, next) {
    const admin = await User.findById(req.user._id);
    const adminHdPoints = admin.adminHdPoints;
    const onShoppingOf = admin.onShoppingOf;
    const RedeemPercent = admin.RedeemPercent;
    res.render('admin/benefits.ejs', {
      adminHdPoints,
      onShoppingOf,
      RedeemPercent
    });
  },

  async updateHdBenefits(req, res, next) {
    const admin = await User.findById(req.user._id);

    admin.adminHdPoints = req.body.adminHdPoints;
    admin.onShoppingOf = req.body.onShoppingOf;
    admin.RedeemPercent = req.body.RedeemPercent;
    await admin.save();
    res.redirect(`/adminDashboard/benefits`);
  },
  async showCouponList(req, res, next) {
    const coupons = await Coupon.find();
    res.render('admin/couponList', { coupons });
  },

  async setting(req, res, next) {
    const admin = await User.findOne({ typeAccess: 'admin' });
    res.render('admin/setting', { admin });
  },
  async updateQuotes(req, res, next) {
    const admin = await User.findOne({ typeAccess: 'admin' });
    admin.quotes = req.body.quotes;
    await admin.save();
    res.redirect('/adminDashboard/setting');
  },

  async getSettings(req, res, next) {
    const admin = await User.findOne({ typeAccess: 'admin' });
    let quotes = admin.quotes;
    res.render('admin/settings.ejs', { quotes });
  },
  async merchantPay(req, res, next) {
    const user = await User.findById(req.params.merchant_id);
    user.hasPaid = true;
    await user.save();
    return res.redirect('back');
  },
  async merchantUnPay(req, res, next) {
    const user = await User.findById(req.params.merchant_id);
    console.log(user.hasPaid);
    user.hasPaid = false;
    await user.save();
    return res.redirect('back');
  },
  async analytics(req, res, next) {
    const coupons = await Coupon.find();
    const merchants = await User.find({ typeAccess: 'merchant' });
    const users = await User.find({ typeAccess: 'user' });

    var totalCoupons = 0;
    var totalMerchants = 0;

    var totalCustomers = 0;

    coupons.forEach(coupon => {
      totalCoupons += 1;
    });

    merchants.forEach(merchant => {
      totalMerchants += 1;
    });

    // if (users) {
    //   users.forEach(function(user) {
    //     if (user.unusedCoupon) {
    //       totalCustomers += 1;
    //     }
    //   });
    // }
    if (users) {
      users.forEach(function(user) {
        totalCustomers += 1;
      });
    }

    res.render('admin/analytics.ejs', {
      totalCoupons,
      totalMerchants,
      totalCustomers
    });
  },
  async specialSignup(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const special = await SpecialSignup.findOne();
    if (req.body.coupons == 0) {
      special.coupons = [];
      special.hdPoints = req.body.hdPoints;
      await special.save();
      return res.redirect('back');
    }
    const coupons = req.body.coupons.split(',');
    special.hdPoints = req.body.hdPoints;
    special.coupons = coupons;
    await special.save();
    res.redirect('back');
  },
  async showSpecialSignup(req, res, next) {
    const special = await SpecialSignup.findOne();

    var coupons = await Coupon.find({
      expireDate: { $gt: Date.now() }
    })
      .populate('author', '_id')
      .select('offerName expireDate quantity offerDetail businessName');
    if (special.coupons[0] != 'None ') {
      var specialCoupons = await Coupon.find()
        .populate('author', '_id')
        .select('offerName expireDate quantity offerDetail businessName')
        .where('_id')
        .in(special.coupons)
        .exec();
    } else {
      specialCoupons = 0;
    }
    const hdPoints = special.hdPoints;
    res.render('admin/specialSignup.ejs', {
      specialCoupons,
      hdPoints,
      coupons
    });
  },

  async getHd(req, res, next) {
    let user = await User.find({}).select('username email number city');
    res.render('admin/hd.ejs', { user });
  },

  async postHd(req, res, next) {
    let { email } = req.body;

    let user = await User.findOne({ email });
    console.log(user, req.body);
    user.HdPoints = req.body.hd;
    await user.save();
    res.redirect('back');
  }
};

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
