'use strict';

var server = require('server');
// var csrfProtection = require('*/cartridge/scripts/middleware/csrf')
// var consentTracking = require('*/cartridge/scripts/middleware/consentTracking')


server.get('HelloWorld', function(req, res, next){
    var myVariable = "my first template";

    res.render("training/myfirsttemplate", {
        myVariable: myVariable
    });

    return next();
});

module.exports = server.exports();