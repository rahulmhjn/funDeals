const axios = require('axios');

module.exports = {
  //send otp for login
  async sendOtp(otp, number) {
    await axios({
      method: 'POST',
      url: 'https://control.msg91.com/api/sendotp.php',
      params: {
        otp,
        sender: 'fundls',
        message: `OTP for your Fun Deals account is : ${otp}`,
        mobile: `91${number}`,
        authkey: process.env.msg91Key
      }
    });
  },
  async customerOrderMsg(number, cartData) {
    const arrCoupon = [];

    for (coupon_id in cartData.items) {
      coupon = cartData.items[coupon_id];
      arrCoupon.push({
        qty: coupon.qty,
        name: coupon.item.offerName,
        price: coupon.price,
        code: coupon.code
      });
    }

    let d = new Date();
    let date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();

    var mail = `Awesome !!!
    That happy face of yours at ${date} is our inspiration.`;

    arrCoupon.forEach(coupon => {
      mail =
        mail +
        `Your coupon code is ${coupon.code} and your coupon is ${coupon.name} .You have bought ${coupon.qty} coupon.`;
    });

    await axios({
      method: 'POST',
      url: 'https://api.msg91.com/api/sendhttp.php',
      params: {
        sender: 'fundls',
        message: `${mail}`,
        mobiles: `91${number}`,
        authkey: process.env.msg91Key
      }
    });
  },
  async specialSignupMsg(phone, cartData, number, hdPoints) {
    const arrCoupon = [];

    for (coupon_id in cartData.items) {
      coupon = cartData.items[coupon_id];
      arrCoupon.push({
        qty: coupon.qty,
        name: coupon.item.offerName,
        price: coupon.price,
        code: coupon.code
      });
    }

    var mail = `<p>Welcome to our world of Happinessdeal.com ! We appreciate your hard work as volunteers for Arpanam2020. Here is your gift of ${hdPoints} HD points and ${number} free coupon specially for you !!.</p>`;

    arrCoupon.forEach(coupon => {
      mail =
        mail +
        `Your coupon code is ${coupon.code} and your coupon is ${coupon.name} .You have bought ${coupon.qty} coupon.`;
    });

    await axios({
      method: 'POST',
      url: 'https://api.msg91.com/api/sendhttp.php',
      params: {
        sender: 'fundls',
        message: `${mail}`,
        mobiles: `91${phone}`,
        authkey: process.env.msg91Key
      }
    });
  }
};
