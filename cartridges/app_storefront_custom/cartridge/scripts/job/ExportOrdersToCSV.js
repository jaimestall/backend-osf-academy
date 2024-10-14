'use strict';

var OrderMgr = require('dw/order/OrderMgr');
var FileWriter = require('dw/io/FileWriter');
var CSVStreamWriter = require('dw/io/CSVStreamWriter');
var File = require('dw/io/File');

function execute(parameters) {
    var file = new File(File.IMPEX + '/orders.csv');
    var fileWriter = new FileWriter(file);
    var csvWriter = new CSVStreamWriter(fileWriter);

    try {
        // Write the CSV header
        csvWriter.writeNext(['Order No', 'Customer Name', 'Total Amount']);

        // Search for new orders
        var orders = OrderMgr.searchOrders('status={0}', 'creationDate desc', dw.order.Order.ORDER_STATUS_NEW);
        while (orders.hasNext()) {
            var order = orders.next();
            // Write order details to CSV
            csvWriter.writeNext([order.orderNo, order.customerName, order.totalGrossPrice.toString()]);
        }
    } catch (e) {
        // Log the error
        var Logger = require('dw/system/Logger');
        Logger.error('Error exporting orders to CSV');
    } finally {
        // Ensure resources are closed
        csvWriter.close();
        fileWriter.close();
    }
}

exports.execute = execute;