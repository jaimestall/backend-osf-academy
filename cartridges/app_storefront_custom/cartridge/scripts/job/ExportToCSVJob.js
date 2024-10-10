'use strict';

var OrderMgr = require('dw/order/OrderMgr');
var FileWriter = require('dw/io/FileWriter');
var CSVStreamWriter = require('dw/io/CSVStreamWriter');

function execute(parameters) {
    var File = require('dw/io/File');
    var filePath = parameters.filePath;
    var csvFile = new File(filePath);
    var fileWriter = new FileWriter(csvFile);
    var csvWriter = new CSVStreamWriter(fileWriter);

    try {
        csvWriter.writeNext(['Order No', 'Customer Name', 'Total Amount']);

        var orders = OrderMgr.searchOrders('status={0}', 'creationDate desc', dw.order.Order.ORDER_STATUS_NEW);
        while (orders.hasNext()) {
            var order = orders.next();
            csvWriter.writeNext([order.orderNo, order.customerName, order.totalGrossPrice.toString()]);
        }
    } catch (e) {
        // Log the error
        var Logger = require('dw/system/Logger');
        Logger.error('Error exporting orders to CSV');
    } finally {
        csvWriter.close();
        fileWriter.close();
    }
}

exports.execute = execute;