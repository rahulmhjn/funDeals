const { validationResult } = require('express-validator'),
  { cloudinary } = require('../cloudinary'),
  bcryptjs = require('bcryptjs'),
  crypto = require('crypto'),
  random = require('random'),
  util = require('util'),
  {
    postForgotPwMail,
    putResetMail,
    verifyEmail,
    successRegisterMail
  } = require('../nodemailer/index.js'),
  { sendOtp } = require('../msg91'),
  User = require('../models/user'),
  SpecialSignup = require('../models/specialSignup'),
  setCoupon = require('./specialSignup');

module.exports = {
  //signup
  async postRegister(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.body.password.length < 5) {
      req.session.error = 'Length of password must be greater than 4';
      return res.redirect('back');
    }

    try {
      //logo upload
      if (req.file) {
        const { secure_url, public_id } = req.file;
        req.body.logo = {
          secure_url,
          public_id
        };
      }
      let otp = String();
      while (otp.length < 4 || otp.length > 4) {
        otp = Math.floor(Math.random() * 10000 + 1).toString();
      }

      const salt = await bcryptjs.genSalt(10);
      req.body.emailVerifyOtp = await bcryptjs.hashSync(otp, salt);
      const user = await User.register(new User(req.body), req.body.password);
      //special signup
      if (req.body.specialSignup == 'true') {
        const specialSignup = await SpecialSignup.findOne({
          name: 'specialSignup'
        });
        setCoupon(user, specialSignup.coupons, Number(specialSignup.hdPoints));
      }

      //send verify otp in email
      await verifyEmail(otp, user.username, user.email);
      const login = util.promisify(req.login.bind(req));
      await login(user);
      req.session.success = 'Registered successfully on Fun Deals!!';
      res.redirect('/auth/verify-email');
    } catch (err) {
      console.log(err.message);
      let error = err.message;
      if (
        error.includes(
          'E11000 duplicate key error index: happiness.users.$username_1 dup key'
        )
      ) {
        error = 'a user with username already exists';
      }
      if (error.includes('number_1 dup key')) {
        error = 'A user with phone number already exists';
      }
      if (
        error.includes(
          'E11000 duplicate key error index: happiness.users.$number_1 dup key'
        )
      ) {
        error = 'a user with this phone number already exists';
      }

      if (
        error.includes('A user with the given username is already registered')
      ) {
        error = 'a user with email already exists';
      }

      //delete logo in case we encounter any error
      if (req.file) await cloudinary.v2.uploader.destroy(req.file.public_id);

      req.session.error = error;
      res.redirect('back');
    }
  },

  async postLogin(req, res, next) {
    const { email, password } = req.body;
    var { user, error } = await User.authenticate()(email, password);
    if (error && !user) return next(error);

    req.login(user, function(err) {
      if (err) return next(error);
      var redirectUrl = '/';
      delete req.session.redirectTo;

      if (user.typeAccess === 'admin') {
        redirectUrl = '/adminDashboard/coupon';
      }
      if (user.typeAccess === 'merchant') {
        redirectUrl = '/merchantDashboard/offer';
      }
      console.log(redirectUrl);
      return res.redirect(redirectUrl);
    });
  },

  async postForgotPw(req, res, next) {
    const token = await crypto.randomBytes(20).toString('hex');
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      req.session.error = `User with ${email} doesn't exists !!`;
      return res.redirect('/');
    }

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    await postForgotPwMail(req, email, token); /* send mail*/

    req.session.success = `An email has been sent to  ${email} with further instructions your link will expire within 1 hour!!`;
    res.redirect('/');
  },

  async getReset(req, res, next) {
    const { token } = req.params;
    const user = User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      req.session.error = 'Reset link is invalid or expired !!';
      return res.redirect('/auth/forgot-password');
    }

    res.render('auth/reset-password.ejs', { token });
  },

  async putReset(req, res, next) {
    const { token } = req.params;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      req.session.error = 'Reset link is invalid or expired !!';
      return res.redirect('/');
    }

    if (req.body.newPassword === req.body.confirmPassword) {
      await user.setPassword(req.body.newPassword);
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();
      const login = util.promisify(req.login.bind(req));
      await login(user);
    } else {
      req.session.error = 'Password must match !!';
      return res.redirect('back');
    }

    await putResetMail(user.email); /*send mail*/

    req.session.success = 'Password updated successfully !!';
    res.redirect('/');
  },

  async postPhoneLogin(req, res, next) {
    const { number } = req.body;
    const user = await User.findOne({ number });
    if (!user) {
      req.session.error = `No user with this mobile number ${number} found`;
      return res.redirect('back');
    }
    let otp = String();
    while (otp.length < 4 || otp.length > 4) {
      otp = Math.floor(Math.random() * 10000 + 1).toString();
    }
    const salt = await bcryptjs.genSalt(10);
    user.loginOtp = await bcryptjs.hashSync(otp, salt);

    user.otpExpires = Date.now() + 300000;
    await user.save();

    await sendOtp(otp, number);
    req.session.success = `An otp has been sent to mobile number ${number} and otp is valid for 5 minutes !!`;
    res.redirect(`/auth/otp/${number}`);
  },

  async postOtp(req, res, next) {
    const { number } = req.params;
    const otp = req.body.a + req.body.b + req.body.c + req.body.d;
    console.log(otp);
    const user = await User.findOne({
      number,
      otpExpires: { $gt: Date.now() }
    });

    if (!user) {
      req.session.error = 'Otp is invalid or expired !!';
      return res.redirect('back');
    }
    const isOtpMatched = await bcryptjs.compare(otp, user.loginOtp);

    if (!isOtpMatched) {
      req.session.error = 'Otp is invalid or expired !!';
      return res.redirect('back');
    }

    user.loginOtp = null;
    user.otpExpires = null;
    await user.save();
    //login user
    const login = util.promisify(req.login.bind(req));
    req.session.success = `Welcome back ${user.username} !!`;
    await login(user);
    res.redirect('/');
  },

  async postVerifyEmail(req, res, next) {
    if (!req.isAuthenticated()) {
      return res.redirect('/auth/login');
    }
    const user = req.user;
    //check if email is already verified
    if (user.isEmailVerified) {
      req.session.error = 'Already email verified!!';
      return res.redirect('/');
    }
    //check whether nickname or password is correct or not
    const otp = req.body.a + req.body.b + req.body.c + req.body.d;
    const isOtpMatch = await bcryptjs.compare(otp, user.emailVerifyOtp);

    if (isOtpMatch) {
      user.isEmailVerified = true;
      user.emailVerifyOtp = null;
      await user.save();

      if (user.typeAccess === 'merchant') {
        return res.render('auth/merchantPayment.ejs');
      }
      req.session.success = `${user.username} your email is verified`;
      if (user.typeAccess === 'user') {
        await successRegisterMail(req.user.email);
      }

      return res.redirect('/');
    }
    req.session.error = `Invalid Otp !!`;
    res.redirect('back');
  },

  async getResendEmailVerification(req, res, next) {
    if (!req.isAuthenticated()) {
      return res.redirect('/auth/login');
    }
    const user = req.user;
    //check if email is already verified
    if (user.isEmailVerified) {
      req.session.error = 'Already email verified!!';
      return res.redirect('/');
    }

    let otp = String();
    while (otp.length < 4 || otp.length > 4) {
      otp = Math.floor(Math.random() * 10000 + 1).toString();
    }
    const salt = await bcryptjs.genSalt(10);
    user.emailVerifyOtp = await bcryptjs.hashSync(otp, salt);
    //send verify otp in email
    await verifyEmail(otp, user.username, user.email);
    await user.save();
    req.session.success = `A verification email has been sent again to ${user.email}`;
    res.redirect('/auth/verify-email');
  },

  getLogout(req, res, next) {
    req.logout();
    res.redirect('/');
  },

  getRegisterMerchant(req, res, next) {
    res.render('auth/registerMerchant.ejs');
  },

  getRegisterUser(req, res, next) {
    if (req.user) {
     return res.redirect('back');
    }
    res.render('auth/registerUser.ejs');
  },

  getLogin(req, res, next) {
    res.render('auth/login.ejs');
  },

  getForgotPw(req, res, next) {
    res.render('auth/forgotPassword.ejs');
  },

  getPhoneLogin(req, res, next) {
    res.render('auth/phoneLogin.ejs');
  },

  getOtp(req, res, next) {
    const { number } = req.params;
    res.render('auth/Otp.ejs', { number });
  },

  getVerifyEmail(req, res, next) {
    if (!req.isAuthenticated()) {
      return res.redirect('/auth/login');
    }

    const user = req.user;
    //check if email is already verified
    if (user.isEmailVerified) {
      req.session.error = 'Already email verified!!';
      return res.redirect('/');
    }
    res.render('auth/verifyEmail.ejs');
  },

  async merchantPay(req, res, next) {
    const user = await User.findById(req.user._id);
    user.hasPaid = true;
    await user.save();
    return res.redirect('/merchantDashboard/offer');
  }
};

function getOtp() {
  return random.int(0, 10000).toString();
}
