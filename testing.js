/* var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  //host: 'mail.happinessdeal.com',
  //port: 25,
  //secure: false, // true for 465, false for other ports
  service: 'gmail',
  auth: {
    user: 'happinessdeal8@gmail.com',
    pass: 'random@15'
  }
});

var mailOptions = {
  from: 'happinessdeal8@gmail.com',
  bcc: ['vikramsingh15j@gmail.com','vineet981013@gmail.com'],
  subject: 'Sending Email using Node.js',
  html: `<h3>Verify your email address</h3>
      <p>Hii</p>
      <p>Thanks for signing up to Fun Deals.</p>
      <p>To get access to your account please verify your email address. </p>
      <p>Your OTP is <span style="color:blue;">2345<span></p>
      <p>Regards,</p>
      <div><b>The Fun Deal Team</b></div>`
};

transporter.sendMail(mailOptions, function(error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

 */

// create reusable transporter object using the default SMTP transport
/* let transporter = nodemailer.createTransport({
    host: 'mail.YOURDOMAIN.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'YOUREMAIL', // generated ethereal user
        pass: 'YOURPASSWORD'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Nodemailer Contact" <your@email.com>', // sender address
      to: 'RECEIVEREMAILS', // list of receivers
      subject: 'Node Contact Request', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
  };
  */
/*
const Nexmo = require('nexmo');
// Init Nexmo
const nexmo = new Nexmo(
  {
    apiKey: 'a4c37ac2',
    apiSecret: 'O8bzvafa2xtzWGSn'
  },
  { debug: true }
);

const text = 'hall worlsdf';
const number = '918368023227';
nexmo.message.sendSms(
  '918383059953',
  number,
  text,
  { type: 'unicode' },
  (err, responseData) => {
    if (err) {
      console.log(err);
    } else {
      const { messages } = responseData;
      const {
        ['message-id']: id,
        ['to']: number,
        ['error-text']: error
      } = messages[0];
      console.dir(responseData);
      // Get data from response
      const data = {
        id,
        number,
        error
      };

      // Emit to the client
      console.log('smsStatus', data);
    }
  }
);
*/
// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
/*const accountSid = 'ACcd747baac1317ee8a6e89eb1f4326f43';
const authToken = 'de0784c740faf4388053b83e4689e2e7';
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
    body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
    from: '+12054650445',
    to: '+918368023227'
  })
  .then(message => console.log(message.sid));
*/
 const axios = require('axios');
/*
axios.get(
  'https://api.msg91.com/api/sendhttp.php?mobiles=8383059953&authkey=295100Ak5dRJNa805d84cf50&route=4&sender=HAPDLS&message=Hello! This is a test message&country=91'
);
*/

// axios.post(
//   'https://api.msg91.com/api/sendhttp.php?mobiles=9958120723&authkey=295100Ak5dRJNa805d84cf50&sender=HDFC&message=otp is 3456&country=91'
// );

 axios({
      method: 'POST',
      url: 'https://api.msg91.com/api/sendhttp.php',
      params: {
        sender: 'HAPDLS',
        message: `${mail}`,
        mobiles: `91${9958120723}`,
        authkey: process.env.msg91Key
      }
    });

/* 
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  //host: 'mail.happinessdeal.com',
  //port: 25,
  //secure: false, // true for 465, false for other ports
  service: 'gmail',
  auth: {
    user: 'happinessdeal8@gmail.com',
    pass: 'random@15'
  }
});

cartData = {
  items: {
    1: { item: { offerName: 'name one' }, price: 20, qty: 1, code: 1234 },
    2: { item: { offerName: 'name two' }, price: 3, qty: 1, code: 45678 }
  },
  totalPrice: 23,
  qty: 2
};
const totalPrice = 467;
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
var mail = `<h2>Your Order details are</h2>`;
arrCoupon.forEach(coupon => {
  mail = mail + `<h2>CouponName:${coupon.name}</h2>`;
  mail = mail + `<h2>CouponQty:${coupon.qty}</h2>`;

});

console.log(mail);
 const msg = {
  from: process.env.email,
  to: 'vikramsingh15j@gmail.com',
  subject: 'Fun Deals - Order Placed',
  html: `${mail}`
};

transporter.sendMail(msg, function(error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
 */

// const nodemailer = require('nodemailer');
// transporter = nodemailer.createTransport({
//   //host: 'mail.happinessdeal.com',
//   //port: 25,
//   //secure: false,
//   service: 'gmail',
//   auth: {
//     user: 'happinessdeal8@gmail.com',
//     pass: 'random@15'
//   }
// });

// const msg = {
//   from: "happinessdeal8@gmail.com",
//   to: 'vikramsingh15j@gmail.com',
//   subject: 'Fun Deals - Forgot Password / Reset',
//   html: `<h3>Forgot password</h3>
//       <p>That's ok we are here for you &#128522;</p>
//       <p>Your link to regenerate password is </p>
// 		  <p>hjfeklghkjfdsla;</p>
// 			<p>If you did not request this, please ignore this email and
//       your password will remain unchanged.</p>
//       <div><b>The Fun Deal Team</b></div>`
// };

// transporter.sendMail(msg, function(error, info) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });

    // console.log(process.env.razorpayKeySecret);
    // //cart add

    // var instance = new Razorpay({
    //   key_id: process.env.razorpayKeyId,
    //   key_secret: process.env.razorpayKeySecret
    // });
    
    // const nodemailer = require("nodemailer"),
    //   transporter = nodemailer.createTransport({
    //     service: "gmail",
    //     auth: {
    //       user: process.env.email,
    //       pass: process.env.pass
    //     }
    //   });
//       var x = Date.now();
// let d = new Date(x);
// let date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
// let time = d.toLocaleTimeString();
// console.log(time)

// const random=require('random')
// x = random.int(0, 10000).toString();
// console.log(x)