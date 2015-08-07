var CONST = require('../../constants');
var RESPONSE = require('../../constants/response');
var TRA = require('../../constants/traServices');
var SessionHandler = require('../sessions');
var request = require('request');
var async = require('async');

var AVAILABLE_STATUS = {
    AVAILABLE: 'Available',
    NOT_AVAILABLE: 'Not Available',
    RESERVED: 'Reserved'
};

var tmaTraServicesViaSocket = function(db) {
    'use strict';

    var session = new SessionHandler(db);
    //var User = db.model(CONST.MODELS.USER);

    this.sendRequest = function (serviceOptions, serviceAccount, req, userId, callback) {

        var userRequestBody = req.body;
        var antiHttpRegEX = /^(?:(?:https?|ftp):\/\/)/;
        var antiLastSlashRegEX = /\/+$/;
        var urlForConnection = (serviceOptions.baseUrl + serviceOptions.url).replace(antiHttpRegEX,'');

        urlForConnection = urlForConnection.replace(antiLastSlashRegEX,'');

        handleWhoisSocket(userRequestBody[serviceOptions.params.body], urlForConnection, function (err, data) {
            if (err) {
                return callback(err);
            }

            return callback(null, data);
        });

        function handleWhoisSocket(checkUrl, reqUrl, callback) {

            var net = require('net');
            var clientSocket = new net.Socket();

            clientSocket.connect(serviceOptions.port, reqUrl, function () {
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
    };
};

module.exports = tmaTraServicesViaSocket;


