var CONST = require('../constants');
var RESPONSE = require('../constants/response');
var TRA = require('../constants/traServices');

var request = require('request');
var SessionHandler = require('./sessions');

var AVAILABLE_STATUS = {
    AVAILABLE: 'Available',
    NOT_AVAILABLE: 'Not Available',
    RESERVED: 'Reserved'
};

var NO_DATA_FOUND = '';

var TestTRAHandler = function (db) {
    'use strict';

    var mongoose = require('mongoose');
    var validation = require('../helpers/validation');
    var session = new SessionHandler(db);


    this.testWhois = function (req, res, next) {

        var checkUrl = req.query.checkUrl;

        handleWhoisSocket(checkUrl, TRA.WHOIS_URL, function (err, data) {
            if (err) {
                return next(err);
            }
            var parsedData = parseDataToJson(data);

            return res.status(200).send({urlData: parsedData});
        });
    };

    function parseDataToJson(urlData) {
        var reg = new RegExp("(.*?):(.*)");
        var elements = urlData.match(/(.*?):(.*?\r\n?)/g);
        var result = {};
        for (var i = 0; i < elements.length; i++) {
            var m = reg.exec(elements[i]);

            if (m) {
                result[m[1]] = m[2].trim();
            } else {
                console.log('Not parsed: ' + elements[i]);
            }
        }

        console.dir(result);
        return result;
    }

    this.testWhoisCheck = function (req, res, next) {

        var checkUrl = req.query.checkUrl;

        handleWhoisSocket(checkUrl, TRA.WHOIS_CHECK_URL, function (err, data) {
            if (err) {
                return next(err);
            }
            data = data.replace(/\r?\n/g, '');
            return res.status(200).send({availableStatus: data});
        });
    };

    function handleWhoisSocket(checkUrl, reqUrl, callback) {

        var net = require('net');
        var clientSocket = new net.Socket();

        clientSocket.connect(TRA.WHOIS_PORT, reqUrl, function () {
            console.log('Connected');
            clientSocket.write(checkUrl + '\r\n');
        });

        clientSocket.on('data', function (data) {
            var strData = data.toString('utf8');

            console.log('Received: ' + data);
            callback(null, strData);
        });

        clientSocket.on('drain', function (data) {
            console.log('Received: ' + data);
            console.log('Connection drain');
            callback(null, data);
        });

        clientSocket.on('lookup', function (err, data) {
            console.log('Received: ' + data);
            console.log('Connection lookup');
        });

        clientSocket.on('finish', function (e, d) {
            console.log(e);
            console.log(d);
            console.log('Connection finish');
        });

        clientSocket.on('close', function (e, d) {
            console.log(e);
            console.log(d);
            console.log('Connection close');
        });

        clientSocket.on('end', function (e, d) {
            console.log(e);
            console.log(d);
            console.log('Connection end');
        });

        clientSocket.on('error', function (err) {
            console.log('Error occurred: ' + err.message);
            callback(err);
        });
    }

    this.searchMobileImei = function (req, res, next) {

        var imei = req.query.imei;

        if (!imei) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS + ': IMEI'});
        }

        var startIndex = req.query.start || 0;
        var endIndex = req.query.end || 10;

        var requestBody = {
            startIndex: startIndex,
            endIndex: endIndex,
            tac: imei
        };

        sendSearchRequest(requestBody, function (err, result) {
            if (err) {
                return res.status(500).send({error: err});
            }
            return res.status(200).send(result);
        });
    };

    this.searchMobileBrand = function (req, res, next) {

        var brand = req.query.brand;

        if (!brand) {
            res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS + ': brand'});
        }

        var startIndex = req.query.start || 0;
        var endIndex = req.query.end || 10;

        var requestBody = {
            startIndex: startIndex,
            endIndex: endIndex,
            manufacturer: brand
        };

        sendSearchRequest(requestBody, function (err, result) {
            if (err) {
                return res.status(500).send({error: err});
            }
            return res.status(200).send(result);
        });
    };

    function sendSearchRequest(reqBody, callback) {

        var reqOptions = {
            method: 'POST',
            headers: {'api_key': 'int'},
            body: reqBody,
            json: true,
            rejectUnauthorized: false,
            requestCert: true,
            agent: false
        };

        request(TRA.MOBILE_SEARCH_URL, reqOptions, function (err, res, body) {
            if (!err && res.statusCode == 200) {
                return callback(null, res.body);
            }
            return callback(err)
        });
    }

};

module.exports = TestTRAHandler;