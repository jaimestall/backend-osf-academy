'use strict';
 
var server = require('server');
server.extend(module.superModule);

var BasketMgr = require('dw/order/BasketMgr');
var ProductMgr = require('dw/catalog/ProductMgr');


function getCartTotal() {
    var currentCart = BasketMgr.getCurrentBasket();

    if (currentCart) {
        var totalGrossPrice = currentCart.getTotalGrossPrice();
        return totalGrossPrice.value;
    }

    return 0;
}

function sendCartEmailNotification(customerEmail, productDetails) {
    var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers')
    var emailObj = {
        to: customerEmail,
        subject: 'Item Added to Cart',
        from: 'no-reply@yourstore.com',
        type: emailHelpers.emailTypes.registration
    };

    var context = {
        firstName: productDetails.firstName,
        productName: productDetails.productName,
        productPrice: productDetails.productPrice,
        description: productDetails.description,
        quantity: productDetails.quantity,
        image: productDetails.image
    };

    emailHelpers.send(emailObj, 'cart/cartEmailNotification', context);
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

server.append('AddProduct', function (req, res, next) {
    var viewData = res.getViewData();
    var currentCustomer = req.currentCustomer.raw;
    // productId from the URL
    var productId = req.form.pid;

    if (currentCustomer.authenticated && currentCustomer.profile && productId) {
        var product = ProductMgr.getProduct(productId);
        if (product) {
            var image = product.getImage('medium', 0)
            if(image) {
                var productDetails = {
                    firstName: currentCustomer.profile.firstName,
                    productName: product.name,
                    productPrice: product.priceModel.price.value,
                    description: product.shortDescription,
                    quantity: res.viewData.quantityTotal,
                    image: image.httpURL
                }
                sendCartEmailNotification(currentCustomer.profile.email, productDetails);
            }
        }
    }
    


    res.setViewData(viewData);
    return next();
});

module.exports = server.exports();