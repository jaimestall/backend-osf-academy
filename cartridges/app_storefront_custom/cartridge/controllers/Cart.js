'use strict';
 
var server = require('server');
var BasketMgr = require('dw/order/BasketMgr'); // Gerencia o carrinho do usuário
 
server.extend(module.superModule);
 
server.append('Show', function (req, res, next) {
    var currentBasket = BasketMgr.getCurrentOrNewBasket();
    var viewData = res.getViewData();

    viewData.currentBasket = currentBasket;
    res.setViewData(viewData);

    return next();
});

server.post('AddProduct', function (req, res, next) {
    var viewData = res.getViewData();
    var currentBasket = BasketMgr.getCurrentOrNewBasket();
    var productLineItems = currentBasket.productLineItems;
    var product = req.form.pid;
    // var quantity = parseInt(req.form.quantity, 10);
    // var productToAdd = productLineItems.addProductToBasket(product, quantity);
    viewData.productLineItems = productLineItems;
    viewData.product = product;
    res.setViewData(viewData);
    
    return next();
});

module.exports = server.exports();