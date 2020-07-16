Cart= function(oldCart) {
  this.items = oldCart.items || {};
  this.totalPrice = oldCart.totalPrice || 0;
  this.totalQty = oldCart.totalQty || 0;

};



  Cart.prototype.add = function(item, item_id) {
    let storedItem = this.items[item_id];
    if (!storedItem) {
      storedItem = this.items[item_id] = {
        item,
        price: 0,
        qty: 0
      };
    }
    //TODO replace->merchantAmount->adminAmount
    storedItem.qty++;
    storedItem.price = storedItem.qty * item.adminAmount;

    this.totalPrice += item.adminAmount;
    this.totalQty++;
  };

  Cart.prototype.multiply = function(item, item_id, mul_qty) {
    let storedItem = this.items[item_id];
    storedItem.qty = mul_qty;
    storedItem.price = storedItem.qty * item.adminAmount;

    this.totalPrice = 0;
    this.totalQty = 0;
    for (id in this.items) {
      this.totalQty += Number(this.items[id].qty);
      this.totalPrice += Number(this.items[id].item.adminAmount) * Number(this.items[id].qty);

    }
    /* this.totalPrice += item.adminAmount;
     this.totalQty++; */
  };

  Cart.prototype.reduceByOne = function(item_id) {
    //TODO replace->merchantAmount->adminAmount
    this.items[item_id].qty--;
    this.items[item_id].price -= this.items[item_id].item.adminAmount;
    this.totalQty--;
    this.totalPrice -= this.items[item_id].item.adminAmount;
    if (this.items[item_id].qty <= 0) {
      delete this.items[item_id];
    }
  };

  Cart.prototype.remove = function(item_id) {
    //TODO replace->merchantAmount->adminAmount
    this.totalPrice -= this.items[item_id].price;
    this.totalQty -= this.items[item_id].qty;
    delete this.items[item_id];
  };

  Cart.prototype.orderPlaced = function() {
    this.totalPrice = 0;
    this.totalQty = 0;
    this.items = {};
  };

module.exports=Cart

 /* 


{
        items:{
          1:{item,price:40,qty:2},2:{item,price:3,qty:1}}
        }
          
        totalPrice:23,
        totalQty:2
    } */
