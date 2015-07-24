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
        if (!req.session.token && serviceOptions.params.needUserAuth) {
            console.log('!req.session.token && serviceOptions.params.needUserAuth', !req.session.token, serviceOptions.params.needUserAuth);
            return async.series([createSendAuthRequest(), createSendRequest()], function (err, results) {
                if (err) {
                    console.log(err);
                    return callback(err);
                    //return requestWithSignIn();
                }
                return callback(null, results);
            });
        } else {
            console.log('!req.session.token && serviceOptions.params.needUserAuth', req.session.token, serviceOptions.params.needUserAuth);
            return async.series([createSendRequest()], function (err, results) {
                if (err) {
                    console.log(err);
                    return callback(err);
                    //return requestWithSignIn();
                }
                return callback(null, results);
            });
        }

        //2 if not - auth get token -> session.register + token -> 5

        //3 if yes - check token -> 5

        //4 if not - auth get token -> session.token

        //5  send request

        //6  respons process

        // if 401 - Unauthorizate goto stage 4



        //if (!serviceAccount.userCookie) {
        //    return requestWithSignIn();
        //
        //} else {
        //
        //    return async.series([createSendRequestFunction()], function (err, results) {
        //        if (err) {
        //            console.log(err);
        //            //return callback(err);
        //            return requestWithSignIn();
        //        }
        //        return callback(null, results);
        //    });
        //}

        //function requestWithSignIn() {
        //    var tasks = [];
        //
        //    tasks.push(createUserSignInFunction());
        //    tasks.push(createSendRequestFunction());
        //    tasks.push(createSaveCookieFunction());
        //
        //    async.series(tasks, function (err, results) {
        //        if (err) {
        //            console.log(err);
        //            return callback(err);
        //        }
        //        return callback(null, results);
        //    });
        //}

        function createSendRequest() {
            return function (callback) {

                var serviceUrl = serviceOptions.baseUrl + serviceOptions.url;

                request(serviceUrl, {
                    method: serviceOptions.method,
                    headers: {'User-Agent': 'Kofevarka'},
                    body: userRequestBody,
                    json: true
                }, function (err, res, body) {
                    if (!err && res.statusCode == 200) {

                        return callback(null, res.body)
                    }
                    return callback(err + res.statusMessage)
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

        //function createSaveCookieFunction() {
        //    return function (callback) {
        //
        //        User
        //            .update({'_id': userId, 'accounts.serviceProvider': serviceOptions.serviceProvider}, {
        //                $set: {
        //                    'accounts.$.userCookie': userCookiesString,
        //                    'accounts.$.cookieUpdatedAt': new Date()
        //                }
        //            }, function (err, data) {
        //                if (err) {
        //                    return callback(err);
        //                }
        //                return callback(null, 'Cookies saved in User');
        //            });
        //    }
        //}
    };
};

module.exports = TmaTraServices;