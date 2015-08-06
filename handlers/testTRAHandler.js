var CONST = require('../constants');
var RESPONSE = require('../constants/response');

var WHOIS_URL = 'whois.aeda.net.ae';
var WHOIS_CHECK_URL = 'whois-check.aeda.net.ae';
var WHOIS_PORT = 43;

var AVAILABLE_STATUS = {
    AVAILABLE: 'Available',
    NOT_AVAILABLE: 'Not Available',
    RESERVED: 'Reserved'
};

var TestTRAHandler = function (db) {
    'use strict';

    this.testWhois = function (req, res, next) {

        var checkUrl = req.query.checkUrl;

        handleWhoisSocket(checkUrl, WHOIS_URL, function (err, data) {
            if (err) {
                return next(err);
            }
            return res.status(200).send({receivedData: data});
        });
    };

    this.testWhoisCheck = function (req, res, next) {

        var checkUrl = req.query.checkUrl;

        handleWhoisSocket(checkUrl, WHOIS_CHECK_URL, function (err, data) {
            if (err) {
                return next(err);
            }
            return res.status(200).send({availableStatus: data});
        });
    };

    function handleWhoisSocket(checkUrl, reqUrl, callback) {

        var net = require('net');
        var client = new net.Socket();

        client.connect(WHOIS_PORT, reqUrl, function () {
            console.log('Connected');
            client.write('tra.gov.ae'); //TODO set 'checkUrl' from req.params
        });

        client.on('data', function (data) {
            console.log('Received: ' + data);
            client.destroy();

            callback(null, data);
        });

        client.on('', function (data) {
            //TODO Remove it
            console.log('Received: ' + data);
            client.destroy();

            callback(null, data);
        });

        client.on('close', function () {
            console.log('Connection closed');
        });

        client.on('error', function (err) {
            console.log('Error occurred: ' + err.message);

            callback(err);
        });
    }
};

module.exports = TestTRAHandler;