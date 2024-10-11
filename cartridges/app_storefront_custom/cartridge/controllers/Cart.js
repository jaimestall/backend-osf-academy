'use strict';
 
var server = require('server');
server.extend(module.superModule);
var BasketMgr = require('dw/order/BasketMgr');

function getCartTotal() {
    var currentCart = BasketMgr.getCurrentBasket();

    if (currentCart) {
        var totalGrossPrice = currentCart.getTotalGrossPrice();
        return totalGrossPrice.value;
    }

    return 0;
}

 
server.append('Show', function (req, res, next) {
    var viewData = res.getViewData();
    var cartTotal = getCartTotal();
    var customMessage = ''

    if(cartTotal > 200) {
        viewData.cartTotal = cartTotal;
        customMessage = "Your cart total (" + cartTotal + "$) exceeds 200$!";
        viewData.customMessage = customMessage;
    }

    res.setViewData(viewData);


    return next();
});

module.exports = server.exports();