'use strict';
 
var server = require('server');
 
server.extend(module.superModule);
 
server.append('Show', function (req, res, next) {
    var viewData = res.getViewData();
    viewData.example = "rendering by viewData";
    var example2 = 'rendering by res.render()'
    res.setViewData(viewData);
    res.render('cart/cart', {
        example2: example2
    })
    return next();
});

module.exports = server.exports();