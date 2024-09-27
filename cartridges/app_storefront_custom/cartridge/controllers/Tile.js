'use strict';
 
var server = require('server');
 
server.extend(module.superModule);
 
server.append('Show', function (req, res, next) {
    var productHelpers = require('*/cartridge/scripts/helpers/productHelpers');
    var discountPercentage = null;
    
    var viewData = res.getViewData();
    
    var salePrice = viewData.product.price.sales.value;
    var standardPrice = viewData.product.price.list.value;

    if(salePrice) {
        discountPercentage = productHelpers.calculatePercentageOff(standardPrice, salePrice);
        viewData.discount = discountPercentage;
        res.setViewData(viewData)
    }

    res.setViewData(viewData);

    return next();
});

module.exports = server.exports();