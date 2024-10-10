'use strict';
 
const base = module.superModule

function calculatePercentageOff(standardPrice, salePrice) {
    var percentageOff = Math.round((1 - (salePrice / standardPrice)) * 100);

    return percentageOff;
}

base.calculatePercentageOff = calculatePercentageOff
module.exports = base;