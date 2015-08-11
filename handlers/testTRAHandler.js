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
    var mailer = require('../helpers/mailer');
    var session = new SessionHandler(db);
    var EmailReport = db.model(CONST.MODELS.EMAIL_REPORT);

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
        return urlData;
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
            console.log('Received: ' + data);
            //client.destroy();
            var strData = data.toString('utf8');

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
            res.status(400).send(RESPONSE.NOT_ENOUGH_PARAMS);
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
                return res.status(500).send(err);
            }
            return res.status(200).send(result);
        });
    };

    this.searchMobileBrand = function (req, res, next) {

        var brand = req.query.brand;

        if (!brand) {
            res.status(400).send(RESPONSE.NOT_ENOUGH_PARAMS);
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
                return res.status(500).send(err);
            }
            return res.status(200).send(result);
        });
    };


    function sendSearchRequest(reqBody, callback) {

        var reqOptions = {
            method: 'GET',
            headers: {'api_key': 'int'},
            body: reqBody,
            json: true
        };

        request(TRA.MOBILE_SEARCH_URL, reqOptions, function (err, res, body) {
            if (!err && res.statusCode == 200) {
                return callback(null, res.body)
            }
            return callback(err)
        });
    }

    this.complainSmsSpam = function (req, res, next) {

        var serviceType = req.body.serviceType;
        var title = req.body.title;
        var description = req.body.description;
        var mailTo = TRA.EMAIL_COMPLAINSMSSPAM;
        var userId = req.session.uId || null;
        var templateName = 'public/templates/mail/complainSmsSpam.html';
        var from = 'testTRA  <' + TRA.EMAIL_COMPLAIN_FROM + '>';

        var mailOptions = {
            templateName: templateName,
            templateData: {
                serviceType: serviceType,
                title: title,
                description: description,
                userId: userId
            },
            from: from,
            mailTo: mailTo,
            title: title
        };

        mailer.sendReport(mailOptions, function (err, data) {

            //TODO remove console.logs

            var emailReport = new EmailReport({
                serviceType: serviceType,
                title: title,
                description: description,
                mailTo: mailTo,
                userId: userId,
                response: data
            });

            emailReport
                .save(function (err, model) {
                    if (model) {
                        console.log('emailReport saved');
                    } else {
                        console.log('emailReport err saved: ', err);
                    }
                });

            if (err) {
                console.error('err: ', err);
                res.status(500).send({err: err});
            }

            return res.status(200).send({status: RESPONSE.ON_ACTION.SUCCESS});
        });
    };

    this.sendHelpSalim = function(req, res, next) {

        var serviceType = req.body.serviceType;
        var title = 'Complaint to site: ' + req.body.url;
        var description = req.body.description;
        var mailTo = TRA.EMAIL_HELP_SALIM;
        var userId = req.session.uId || null;
        var templateName = 'public/templates/mail/complainSmsSpam.html';
        var from = 'testTRA  <' + TRA.EMAIL_COMPLAIN_FROM + '>';
        console.log('mailTo: ',mailTo)
        var mailOptions = {
            templateName: templateName,
            templateData: {
                serviceType: serviceType,
                title: title,
                description: description,
                userId: userId
            },
            from: from,
            mailTo: mailTo,
            title: title
        };

        mailer.sendReport(mailOptions, function (err, data) {

            //TODO remove console.logs

            var emailReport = new EmailReport({
                serviceType: serviceType,
                title: title,
                description: description,
                mailTo: mailTo,
                userId: userId,
                response: data || err
            });

            emailReport
                .save(function (err, model) {
                    if (model) {
                        console.log('emailReport saved');
                    } else {
                        console.log('emailReport err saved: ', err);
                    }
                });
            if (err) {
                console.error('err: ', err);
                res.status(500).send({err: err});
            }

            return res.status(200).send({status: RESPONSE.ON_ACTION.SUCCESS});
        });
    };
};

module.exports = TestTRAHandler;