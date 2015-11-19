var CONST = require('../../constants');
var RESPONSE = require('../../constants/response');
var SessionHandler = require('../sessions');
var request = require('request');
var async = require('async');

var TmaTraServices = function(db) {
    'use strict';

    var session = new SessionHandler(db);
    //var User = db.model(CONST.MODELS.USER);

    this.sendRequest = function (serviceOptions, serviceAccount, req, userId, callback) {

        var userRequestBody = req.body;

        //1  check session
        //2 if not - auth get token -> session.register + token -> 5

        if(!checkRequiredFields(serviceOptions, userRequestBody)) {
            return callback(new Error(RESPONSE.NOT_ENOUGH_PARAMS));
        }

        if (!req.session.token && serviceOptions.needAuth) {
            console.log('!req.session.token && serviceOptions.params.needUserAuth', !req.session.token, serviceOptions.needAuth);
            return sendRequestWithAuth();
        } else {
            console.log('!req.session.token && serviceOptions.params.needUserAuth', req.session.token, serviceOptions.needAuth);
            return async.series([createSendRequest()], function (err, results) {
                if (err) {
                    console.log(err);

                    //TODO  // if 401 - Unauthorizate goto stage with auth

                    if (err == 'nullUnauthorized') {
                        return sendRequestWithAuth()
                    }
                    return callback(err);
                    //return requestWithSignIn();
                }
                return callback(null, results);
            });
        }

        function checkRequiredFields(serviceOptions, userRequestBody) {
            for (var i = 0; i < serviceOptions.pages.length; i++) {
                for (var j = 0; j < serviceOptions.pages[i].inputItems.length; j++) {
                    if (serviceOptions.pages[i].inputItems[j].required
                        && !userRequestBody[serviceOptions.pages[i].inputItems[j].name]) {
                        return false;
                    }
                }
            }
            return true;
        }

        function sendRequestWithAuth () {
            async.series([createSendAuthRequest(), createSendRequest()], function (err, results) {
                if (err) {
                    console.log(err);
                    return callback(err);
                }
                return callback(null, results);
            });
        }

        function createSendRequest() {
            return function (callback) {
                var tokenString = '';
                var queryString = '';
                var serviceUrl;

                if  (serviceOptions.needAuth) {
                    tokenString = '?access_token=' + req.session.token;
                }

                if (serviceOptions.params && serviceOptions.params.query) {
                    queryString += '?';
                    for (var i = 0, len = serviceOptions.params.query.length - 1; i <= len; i++) {
                        if(i>0) {
                            queryString += '&';
                        }
                        queryString += serviceOptions.params.query[i] + '=' + userRequestBody[serviceOptions.params.query[i]];
                    }
                }

                serviceUrl = serviceOptions.url + queryString;

                console.log(serviceUrl);

                request(serviceUrl, {
                    method: serviceOptions.method,
                    //headers: {'User-Agent': 'Kofevarka'},
                    body: userRequestBody,
                    json: true
                }, function (err, res, body) {
                    if (!err && res.statusCode == 200) {

                        return callback(null, res.body)
                    }
                    return callback(err)
                });
            }
        }

        function createSendAuthRequest() {
            return function (callback) {

                var requestBody = {
                    'imei': 'anonymous'};

                var serviceUrl = 'http://tma.tra.gov.ae/tra_api/auth';

                request.post(serviceUrl, {
                    headers: {'User-Agent': 'Kofevarka'},
                    body: requestBody,
                    json: true
                }, function (err, res, body) {

                    if (!err && res.statusCode == 200) {

                        console.log(body.access_token);
                        session.addToken(req, body.access_token);
                        return callback(null, body)
                    }
                    return callback(err)
                });
            }
        }
    };
};

module.exports = TmaTraServices;