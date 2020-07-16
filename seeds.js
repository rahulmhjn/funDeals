const faker = require('faker');
const Coupon = require('./models/coupon');

async function seedCoupon() {
  for (const i of new Array(10)) {
    const offerDetail = faker.lorem.text();
    const image = { url: faker.random.image() };
    const offerType = 'fashion';
    const offerName = 'Flat 50% off in 100 %';
    const quantity = 4;
    const merchantAmount = 20;
    const businessName = 'Kabir Cloth House';
    const searchKeyWords = '';
    const filterKeyWords = 'kurta,jeans';
    const city = 'Jammu';
    const avgRating = 4;
    const homeField = 'topDeals';
    const couponType = 'Full Day';
    const adminAmount = 3;
    const startDate = '2020-04-25T00:00:00Z';
    const expireDate = '2020-10-07T00:00:00Z';
    const isApproved = true;
    const isPending = false;

    const couponData = {
      offerDetail,
      image,
      offerType,
      offerName,
      quantity,
      businessName,
      author: '5ea36d8bf9c5486119ffa594',
      merchantAmount,
      searchKeyWords,
      filterKeyWords,
      city,
      avgRating,
      homeField,
      couponType,
      startDate,
      expireDate,
      isApproved,
      isPending,
      adminAmount
    };

    let coupon = new Coupon(couponData);
    await coupon.save();
  }
  console.log('10 new coupons created');
}

module.exports = seedCoupon;
