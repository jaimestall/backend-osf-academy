'use strict';
 
var server = require('server');
var ProductMgr = require('dw/catalog/ProductMgr');
var CatalogMgr = require('dw/catalog/CatalogMgr');
var ProductSearchModel = require('dw/catalog/ProductSearchModel');
 
server.extend(module.superModule);

function searchProductsInCategory(categoryId) {
    var category = CatalogMgr.getCategory(categoryId);
    if (!category) {
        throw new Error('Category not found');
    }

    var productSearch = new ProductSearchModel();
    productSearch.setCategoryID(categoryId);
    productSearch.search();

    var products = [];
    var productSearchHit = productSearch.getProductSearchHits();
    while (productSearchHit.hasNext()) {
        var product = productSearchHit.next().getProduct();
        products.push(product);
    }

    return products;
}

 
server.append('Show', function (req, res, next) {
    var viewData = res.getViewData();
    
    // productId from the URL
    var productId = req.querystring.pid;
    
    // Ensures productId is a string
    if (Array.isArray(productId)) {
        productId = productId[0];
    }
    
    // If productId is not null, search for the product and set the viewData
    if (productId) {
        // Search for the product using ProductMgr
        var product = ProductMgr.getProduct(productId);
        
        // If product is not null, set the viewData with the product and the primary category
        if (product) {
            viewData.product = product;
            var primaryCategory = product.getPrimaryCategory();
            viewData.categoryId = primaryCategory ? primaryCategory.getID() : null;
            
            // Search for products in the same category
            if (primaryCategory) {
                var suggestedProducts = searchProductsInCategory(primaryCategory.getID());
                viewData.suggestedProducts = suggestedProducts;
            }            
        }
    }

    viewData.productId = productId;
    
    res.setViewData(viewData);
    return next();
});


module.exports = server.exports();