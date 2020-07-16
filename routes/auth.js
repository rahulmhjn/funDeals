const express = require('express'),
  router = express.Router(),
  {
    asyncErrorHandler,
    setTypeAccess,
    isLoggedIn,
    setSchedule,
    checkInput,
    redirectAdmin,
    redirectMer
  } = require('../middleware'),
  { upload } = require('../cloudinary'),
  {
    postRegister,
    postLogin,
    getLogout,
    getRegisterMerchant,
    getRegisterUser,
    getLogin,
    getForgotPw,
    postForgotPw,
    getReset,
    putReset,
    getPhoneLogin,
    postPhoneLogin,
    postOtp,
    getOtp,
    getVerifyEmail,
    postVerifyEmail,
    merchantPay,
    getResendEmailVerification
  } = require('../controllers/auth'),
  { check } = require('express-validator');

//@Route    POST '/auth/register/user'
//@desc     Register the user
//@access   Public

router.post(
  '/register/user',
  [
    setTypeAccess,
    check('username', 'username is required !!').exists(),
    check('email', 'Enter valid email').isEmail(),
    check('number', 'mobile number is required').exists(),
    check('state', 'state is required').exists(),
    check('city', 'city is required').exists(),
    checkInput
  ],
  asyncErrorHandler(postRegister)
);

//@Route    POST '/auth/register/merchant'
//@desc     Register the merchant
//@access   Public

router.post(
  '/register/merchant',
  [
    upload.single('logo'),
    setSchedule,
    setTypeAccess,
    check('username', 'username is required !!').exists(),
    check('email', 'Enter valid email').isEmail(),
    check('number', 'mobile number is required').exists(),
    check('state', 'state is required').exists(),
    check('city', 'city is required').exists(),
    check('area', 'area is required').exists(),
    check('businessCategory', 'business category is required').exists(),
    check('businessType', 'business type is required').exists(),
    check('businessName', 'business name is required').exists()
  ],
  asyncErrorHandler(postRegister)
);

//@Route    POST '/auth/login'
//@desc     Login the user
//@access   Public

router.post(
  '/login',
  [check('email', 'Enter valid email').isEmail()],
  asyncErrorHandler(postLogin)
);

//@Route    POST '/auth/logout'
//@desc     Logout the user
//@access   Private
router.get('/logout', getLogout);

//@Route    GET '/auth/register/merchant'
//@desc     get request to register merc.
//@access   Public

router.get('/register/merchant', getRegisterMerchant);

//@Route    GET '/auth/register/user/5e2d9deb58113332f044ea33'
//@desc     register user
//@access   Public

router.get('/register/user/5e2d9deb58113332f044ea33', getRegisterUser);

//@Route    GET '/auth/login'
//@desc     get request to login user (admin,merc.,user)
//@access   Public

router.get('/login', redirectMer, redirectAdmin, getLogin);

//@Route    GET '/auth/forgot-password'
//@desc     if the user forget pwd
//@access   public

router.get('/forgot-password', redirectMer, redirectAdmin, getForgotPw);

//@Route    POST '/auth/forgot-password'
//@desc     if the user forget pwd
//@access   public

router.post('/forgot-password', asyncErrorHandler(postForgotPw));

//@Route    GET '/auth/reset/:token'
//@desc     reset pwd token send to mail
//@access   public

router.get('/reset/:token', asyncErrorHandler(getReset));

//@Route    PUT '/auth/reset/:token'
//@desc     change the pwd
//@access   public

router.put('/reset/:token', asyncErrorHandler(putReset));

//@Route    GET '/auth/phone-login'
//@desc     enter phone number
//@access   Public

router.get('/phone-login', getPhoneLogin);

//@Route    POST '/auth/phone-login'
//@desc     check phone number exists if yes send otp
//@access   Public

router.post('/phone-login', postPhoneLogin);

//@Route    GET '/auth/otp/:number'
//@desc     enter otp
//@access   Public

router.get('/otp/:number', redirectMer, redirectAdmin, getOtp);

//@Route    POST '/auth/otp/:number'
//@desc     check whether otp is correct if yes then login
//@access   Public

router.post('/otp/:number', postOtp);

//@Route    GET  '/auth/verify-email'
//@desc     page where we write otp for email verification
//@access   PRIVATE

router.get('/verify-email', getVerifyEmail);

//@Route    POST  '/auth/resend/verify-email'
//@desc     Resend the verification email
//@access   PRIVATE

router.get(
  '/resend/verify-email',
  asyncErrorHandler(getResendEmailVerification)
);

//@Route    POST  '/auth/verify-email'
//@desc     get otp and verify
//@access   Public

router.post('/verify-email', postVerifyEmail);

//@Route    POST  '/auth/merchant-payment'
//@desc     get the payment
//@access   Private

router.post('/merchant-payment', isLoggedIn, asyncErrorHandler(merchantPay));

module.exports = router;
