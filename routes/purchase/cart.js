const express = require('express'),
  router = express.Router(),
  {
    asyncErrorHandler,
    isLoggedIn,
    redirectMer,
    redirectAdmin
  } = require('../../middleware'),
  {
    addToCart,
    addToCartBack,
    showCart,
    showHdCart,
    reduceCartQtyByOne,
    removeItemFromCart,
    mulToCart,
    moveToWishList
  } = require('../../controllers/purchase/cart');

//@Route    GET '/cart'
//@desc     Show all cart items of current user
//@access   Private
router.get('/', isLoggedIn, redirectMer, redirectAdmin, showCart);

//@Route    GET '/cart/Hd'
//@desc     Show all cart items of current user
//@access   Private
router.get('/Hd', isLoggedIn, showHdCart);

//@Route    GET '/cart/add-to-cart/:c_id'
//@desc     It add product to cart of user or add cart qty by one
//@access   Private

router.get('/add-to-cart/:c_id', isLoggedIn, asyncErrorHandler(addToCart));

//@Route    GET '/cart/add-to-cart-back/:c_id'
//@desc     It add product to cart of user or add cart qty by one redirect back
//@access   Private

router.get(
  '/add-to-cart-back/:c_id',
  isLoggedIn,
  asyncErrorHandler(addToCartBack)
);

//@Route    GET '/cart/mul-to-cart/:c_id/:mul_qty'
//@desc     It mul product to cart of user
//@access   Private

router.get(
  '/mul-to-cart/:c_id/:mul_qty',
  isLoggedIn,
  asyncErrorHandler(mulToCart)
);

//@Route    GET '/cart/reduce-by-one/:c_id'
//@desc     It reduce particular item of cart by one
//@access   Private

router.get(
  '/reduce-by-one/:c_id',
  isLoggedIn,
  asyncErrorHandler(reduceCartQtyByOne)
);

//@Route    GET '/cart/remove/:c_id'
//@desc     removes item from cart
//@access   Private

router.get('/remove/:c_id', isLoggedIn, asyncErrorHandler(removeItemFromCart));

//@Route    GET '/cart/add-to-wishList/:c_id'
//@desc     Add item to wishlist
//@access   Private

router.get(
  '/add-to-wishList/:c_id',
  isLoggedIn,
  asyncErrorHandler(moveToWishList)
);

module.exports = router;
