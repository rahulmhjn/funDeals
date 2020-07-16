const express = require('express'),
  router = express.Router(),
  {
    asyncErrorHandler,
    isLoggedIn,
    redirectMer,
    redirectAdmin
  } = require('../../middleware'),
  {
    addToWishList,
    showWishList,
    moveToCart,
    removeItemFromWishList
  } = require('../../controllers/purchase/wishList');

//@Route    GET '/wish-list'
//@desc     Show all wish list items of current user
//@access   Private

router.get('/', isLoggedIn, redirectMer, redirectAdmin, showWishList);

//@Route    GET '/wish-list/add-to-wishList/:c_id'
//@desc     Add item to wishlist
//@access   Private

router.get(
  '/add-to-wishList/:c_id',
  isLoggedIn,
  asyncErrorHandler(addToWishList)
);

//@Route    GET '/wish-list/move-to-cart/:c_id'
//@desc     Move item to cart
//@access   Private

router.get('/move-to-cart/:c_id', isLoggedIn, asyncErrorHandler(moveToCart));

//@Route    GET '/wish-list/remove/:c_id'
//@desc     removes item from wish list
//@access   Private

router.get(
  '/remove/:c_id',
  isLoggedIn,
  asyncErrorHandler(removeItemFromWishList)
);

module.exports = router;
