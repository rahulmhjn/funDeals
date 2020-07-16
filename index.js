require('dotenv').config();
const express = require('express'),
  app = express(),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  mongoose = require('mongoose'),
  passport = require('passport'),
  User = require('./models/user'),
  mongoDb = require('./config/db.js'),
  methodOverride = require('method-override'),
  path = require('path'),
  Search = require('./models/search'),
  State = require('./models/state'),
  bodyParser = require('body-parser'),
  helmet = require('helmet'),
  { redirectMer } = require('./middleware');
//database
mongoDb();

// Init Middleware
app.use(helmet());
app.use(express.json({ extended: false })); //bodyparser (accept datatype of json)
app.use(express.urlencoded({ extended: true })); //bodyparser (accept data from form)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// set public assets directory
app.use(express.static('public'));

//setting up body parser===
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

//Oauth
app.use(
  session({
    secret: 'Ecomhguygu',
    resave: false,
    signed: true,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 308 * 60 * 100000 }
  })
);
//init search and state->don't touch
// async function setSearch() {
//   const search = new Search({ identifier: 'search' });
//   await search.save();
//   console.log('Search created');
// }
async function setState() {
  const state = new State({
    identifier: 'state',
    model: { JK: { Jammu: ['Gandhi Nagar','Pacca Danga','Janipur','Purani Mandi'] } }
  });
  await state.save();
  console.log('State created');
}

//  setSearch();
//  setState();

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(async (req, res, next) => {
  res.locals.title = 'Fun Deal';

  res.locals.currentUser = req.user;

  const searchSuggestion = await Search.findOne({ identifier: 'search' });

  res.locals.search = searchSuggestion.search;
  res.locals.title = 'Fun Deal';
  res.locals.description = `Fun Deal is a platform for merchants/vendors to directly connect with the mass that encourages the growth of the business. It is Jammu’s first ever site to link Food and Fashion industry to the public through discounts and deals that promote values as well as a profitable business. Widen the possibilities by registering with us for free of cost. We offer complete transparency with the detailed analysis of crowd-pulling discounts, ratings, reviews, tele caller services and feedbacks. For the Food industry, we encourage such deals that increase footfalls in the restaurant, café or hotels. For the Fashion industry, we look forward to attract customers by giving them deals that are irresistible to pull them towards Fashion boutiques, stores, shops or malls.`;
  res.locals.image = `https://res.cloudinary.com/dfmotjqxz/image/upload/v1575136239/happiness/logof7ef103052192ff82960f5aadcca50b2.png`;

  // res.locals.razorpayKeyId = process.env.razorpayKeyId;
  res.locals.food = searchSuggestion.food;
  res.locals.fashion = searchSuggestion.fashion;
  res.locals.others = searchSuggestion.others;

  const settings = await State.findOne({ identifier: 'state' });

  res.locals.settings = settings.model;

  res.locals.city = req.session.city;

  res.locals.success = req.session.success;
  delete req.session.success;

  res.locals.error = req.session.error;
  delete req.session.error;

  next();
});


// const seeds=require("./seeds.js");
// seeds() 
//define routes

app.get('/test', (req, res) => {
  res.render('auth/merchantPayment.ejs');
});

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/show-merchant', require('./routes/reviewMerchant'));
app.use('/merchantDashboard', require('./routes/dashboard/merchantDashboard'));
app.use('/adminDashboard', require('./routes/dashboard/adminDashboard'));
app.use('/coupons', require('./routes/coupon'));
app.use('/coupons/:id/reviews', require('./routes/review'));
app.use('/cart', require('./routes/purchase/cart'));
app.use('/wish-list', require('./routes/purchase/wishList'));
app.use('/buy', require('./routes/purchase/buy'));
//it should be at end
app.use('/', require('./routes/index'));

//Error handler
app.use(function(err, req, res, next) {
  console.log(err);
  req.session.error = err.message;
  if (err.kind === 'ObjectId') {
    req.session.error = 'Id Not found in the database!!';
  }

  return res.redirect('back');
});


var https = require("https");
setInterval(function() {
    https.get('https://www.fundeal.com/');
}, 900000); // every 15 minutes (900000)

PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
