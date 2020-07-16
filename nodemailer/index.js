require('dotenv').config();
const nodemailer = require('nodemailer'),
  transporter = nodemailer.createTransport({
    service: 'gmail',
  
  // true for 465, false for other ports
    auth: {
      user: process.env.email,
      pass: process.env.pass
    }
  });

module.exports = {
  async postForgotPwMail(req, clientEmail, token) {
    const msg = {
      from: process.env.email,
      to: clientEmail,
      subject: 'Fun Deals - Forgot Password / Reset',
      html: `<h3>Forgot password</h3>
      <p>That's ok we are here for you &#128522;</p>
      <p>Your link to regenerate password is </p>
		  <p>http://${req.headers.host}/auth/reset/${token}</p>
			<p>If you did not request this, please ignore this email and
      your password will remain unchanged.</p>
      <div><b>The Fun Deal Team</b></div>`
    };

    transporter.sendMail(msg, function(error, info) {
      if (error) {
        console.log('arhul'+error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  },

  async putResetMail(clientEmail) {
    const msg = {
      from: process.env.email,
      to: clientEmail,
      subject: 'Fun Deals - Password Changed',
      html: `<p>Hello,</p>
		  <p>This email is to confirm that the password for your account has just been changed.
      If you did not make this change, please hit reply and notify us at once.</p>
      <div><b>The Fun Deal Team</b></div>`
    };

    transporter.sendMail(msg, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  },

  async successRegisterMail(clientEmail) {
    const msg = {
      from: process.env.email,
      to: clientEmail,
      subject: 'Fun Deals - Successful registration',
      html: `<h3>Successful registration-</h3>
      <p>Congratulations !!!</p> 
      <p>Now you are a part of our happiness world that brings
      to u happydeals all 24*365 days.</p>
      <div><b>The Fun Deal Team</b></div>`
    };

    transporter.sendMail(msg, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  },

  async verifyEmail(otp, userName, clientEmail) {
    let d = new Date();
    let date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();

    const msg = {
      from: process.env.email,
      to: clientEmail,
      subject: 'Fun Deals - Activate your account',
      html: `<p>Begins with today’s date ${date}  your otp for registration is 
      <span style="color:blue;">${otp}<span></p>
      <p>It is great to share happiness and not the OTP.</p>
      <p>Please don't share this password with any one.</p>
      <p>Regards,</p>
      <div><b>The Fun Deal Team</b></div>`
    };

    transporter.sendMail(msg, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  },

  async merchantBoughtEmail(clientEmail, offerName, code) {
    let d = new Date();
    let date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();

    const msg = {
      from: process.env.email,
      to: clientEmail,
      subject: 'Fun Deals - Customer Bought your coupon',
      html: `<p>Happiness is just around the corner.</p>
      <p> Your ${offerName} ${code}(code) has been bought on ${date}.</p>
      
      <div><b>The Fun Deal Team</b></div>`
    };

    transporter.sendMail(msg, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  },

  async customerOrderEmail(customerEmail, cartData) {
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

    var mail = `<p>Awesome !!!</p>
      <p>That happy face of yours at ${date} is our inspiration.</p>`;

    arrCoupon.forEach(coupon => {
      mail =
        mail +
        `<p>Your coupon code is ${coupon.code} and your coupon is ${coupon.name} .You have bought ${coupon.qty} coupon</p>`;
    });

    const msg = {
      from: process.env.email,
      to: customerEmail,
      subject: 'Fun Deals - Deal bought ',
      html: `${mail}
      <p>Regards,</p>
      <div><b>The Fun Deal Team</b></div>`
    };

    transporter.sendMail(msg, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  },
  async specialSignupEmail(customerEmail, cartData, number, hdPoints) {
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

    var mail = `<p>Welcome to our world of Fundeal.com ! We appreciate your hard work as volunteers for Arpanam2020. Here is your gift of ${hdPoints} HD points and ${number} free coupon specially for you !!.</p>`;

    arrCoupon.forEach(coupon => {
      mail =
        mail +
        `<p>Your coupon code is ${coupon.code} and your coupon is ${coupon.name} .You have bought ${coupon.qty} coupon</p>`;
    });

    const msg = {
      from: process.env.email,
      to: customerEmail,
      subject: 'Fun Deals - Special gift from Fundeal.com',
      html: `${mail}
      <p>Regards,</p>
      <div><b>The Fun Deal Team</b></div>`
    };

    transporter.sendMail(msg, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  },
  async customerUsedCouponEmail(clientEmail, couponName) {
    const msg = {
      from: process.env.email,
      to: clientEmail,
      subject: `Fun Deals - Coupon Used`,
      html: `<p>Coupon Named-${couponName} is Used</p><p>If your happy , we are happy.
      Your Fun Deal has been successfully used .
      Being happy is being healthy,
      Keep smiling and visit</p> <a>FunDeal.com</a>`
    };

    transporter.sendMail(msg, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  },
  async dealAcceptedEmail(clientEmail, couponName) {
    const msg = {
      from: process.env.email,
      to: clientEmail,
      subject: `Fun Deals - Deal accepted `,
      html: `<p>Your Fun Deal has been approved by  <a>FunDeal.com</a>.
      Patience after hardwork is the key to success.</p> `
    };

    transporter.sendMail(msg, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  },
  async dealRejectedEmail(clientEmail, couponName) {
    const msg = {
      from: process.env.email,
      to: clientEmail,
      subject: `Fun Deals - Deal rejected `,
      html: `<p>We are not happy that your Fun Deal has been rejected.
      Kindly contact <a>hd.com</a> for further information and query.</p> `
    };

    transporter.sendMail(msg, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
};
