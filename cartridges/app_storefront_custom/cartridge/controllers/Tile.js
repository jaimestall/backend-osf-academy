'use strict'

var server = require('server');
 
server.extend(module.superModule);

server.append('Show', function (req, res, next) {
    var productHelpers = require('*/cartridge/scripts/helpers/productHelpers');
    var viewData = res.getViewData();

    var salePrice = parseInt(viewData.product.price.sales.value);
    if(viewData.product.price.list) {
        var standardPrice = parseInt(viewData.product.price.list.value);
    } else {
        var standardPrice = parseInt(viewData.product.price.sales.value)
    }
    
    // productId from the URL
    var productId = String(req.querystring.pid);

    if(salePrice < standardPrice) {
        var discount = productHelpers.calculatePercentageOff(standardPrice, salePrice)
        viewData.discount = discount
    }

    viewData.salePrice = salePrice
    viewData.standardPrice = standardPrice
    viewData.productId = productId
    res.setViewData(viewData);

    return next();

});


module.exports = server.exports();