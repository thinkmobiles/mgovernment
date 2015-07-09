var CONST = require('../constants');
var RESPONSE = require('../constants/response');
var UserHistoryHandler = require('./userHistoryLog');
var SessionHandler = require('./sessions');
var request = require('request');
var request = request.defaults({jar: true});
var async = require('async');
var mongoose = require('mongoose');

var UserService = function(db) {
    'use strict';

    var Service = db.model(CONST.MODELS.SERVICE);
    var session = new SessionHandler(db);
    var User = db.model(CONST.MODELS.USER);

    var userHistoryHandler = new UserHistoryHandler(db);

    this.getServiceOptions = function (req, res, next) {

        var searchQuery = {
            _id: req.params.serviceId
        };

        getServiceOptionsById(searchQuery, function (err, model) {

            var log = {
                userId: req.session.uId || 'Unauthorized',
                action: CONST.ACTION.GET,
                model: CONST.MODELS.SERVICE,
                modelId: searchQuery._id,
                req: {params: req.params, body: req.params},
                res: model,
                description: 'getServiceOptions'
            };

            userHistoryHandler.pushlog(log);

            if (err) {
                return res.status(400).send({err: 'Service Option not found'});
            }
            return res.status(200).send(model);
        })
    };

    this.getServices = function (req, res, next) {

        Service
            .find()
            .select('_id serviceProvider serviceName serviceType profile forUserType method baseUrl')
            .exec(function (err, collection) {
                if (err) {
                    return next(err);
                }

                var log = {
                    userId: req.session.uId || 'Unauthorized',
                    action: CONST.ACTION.GET,
                    model: CONST.MODELS.SERVICE,
                    modelId: '',
                    req: {params: req.params, body: req.params},
                    res: collection,
                    description: 'getServices'
                };
                userHistoryHandler.pushlog(log);

                return res.status(200).send(collection);
            });
    };

    this.sendServiceRequest = function (req, res, next) {

        var body = req.body;
        var userId = req.session.uId;
        var serviceId = req.params.serviceId;
        var found = false;
        var foundNumber = -1;
        var serviceOptions;
        var serviceAccount;
        var tasks =[];
        var userCookiesObject = request.jar();
        var userCookies;
        var userCookiesString;

        /// GET SERVICE Options BY ID
        tasks.push(createGetServiceOptionsFunction());

        /// GET UserAccountFor Service by session id
        tasks.push(createGetServiceAccesOptionsFunction());

        /// Outside Server process Handler
        tasks.push(createSendDataToCapalabaFunction());

        /// Async main process service Handlers
        async.series(tasks, function (err,results){
            if (err) {
                return res.status(400).send(err);
            }

            var log = {
                userId: req.session.uId || 'Unauthorized',
                action: CONST.ACTION.POST,
                model: CONST.MODELS.SERVICE,
                modelId: serviceId,
                req: {params: req.params, body: req.params},
                res: results,
                description: 'sendServiceRequest'
            };

            userHistoryHandler.pushlog(log);
            return res.status(200).send(results);
        });

        function createGetServiceOptionsFunction() {
            return function (callback) {

                getServiceOptionsById(serviceId, function (err, model) {

                    if (err) {
                        return callback(err);
                    }

                    serviceOptions = model.toJSON();
                    return callback();
                })
            };
        }

        function createGetServiceAccesOptionsFunction() {
            return function (callback) {

                getUserById(userId, function (err, user) {
                    user = user.toJSON();

                    for (var i = user.accounts.length - 1; i >= 0; i--) {
                        if (user.accounts[i].serviceProvider == serviceOptions.serviceProvider) {
                            foundNumber = i;
                            found = true;
                        }
                    }
                    if (!found) {
                        return callback('Service Account not found');
                    }
                    serviceAccount = user.accounts[foundNumber];
                    return callback();
                });
            }
        }

        function createSaveCookieFunction() {
            return function (callback) {

                User
                    .update({'_id': userId, 'accounts.serviceProvider': serviceOptions.serviceProvider}, {
                        $set: {
                            'accounts.$.userCookie': userCookiesString,
                            'accounts.$.cookieUpdatedAt': new Date()
                        }
                    }, function (err, data) {
                        if (err) {
                            return callback(err);
                        }
                        return callback(null, 'Cookies saved in User');
                    });
            }
        }

        function createSendDataToCapalabaFunction() {
            return function (callback) {

                var cookie;

                if (!serviceAccount.userCookie) {
                    requestWithSignIn();

                } else {

                    cookie = request.cookie(serviceAccount.userCookie);
                    userCookiesObject.setCookie(cookie, serviceOptions.baseUrl);

                    async.series([createSendRequestFunction()],function (err,results) {
                        if (err) {
                            console.log(err);
                            //return callback(err);
                            return requestWithSignIn();
                        }
                        return callback(null, results);
                    });
                }

                function requestWithSignIn() {
                    var tasks = [];

                    tasks.push(createUserSignInFunction());
                    tasks.push(createSendRequestFunction());
                    tasks.push(createSaveCookieFunction());

                    async.series(tasks, function (err,results){
                        if (err) {
                            console.log(err);
                            return callback(err);
                        }
                        return callback(null, results);
                    });
                }

                function createSendRequestFunction(){
                    return function (callback){

                        var serviceUrl = serviceOptions.baseUrl + serviceOptions.url;

                        request(serviceUrl, {method: serviceOptions.method, headers: {'User-Agent': 'Kofevarka'}, jar: userCookiesObject, json: true }, function (err, res, body) {
                            if (!err && res.statusCode == 200) {

                                console.log(' ----------------------------------------------------------- User:',serviceOptions.method,': ', serviceUrl,' ', body);
                                userCookiesString = userCookiesObject.getCookieString(serviceUrl);
                                userCookies = userCookiesObject.getCookies(serviceUrl);
                                console.log('Cookies USER REQUEST:',userCookiesString );
                                return  callback(null,res.body)
                            }
                            return callback(err + res.statusMessage)
                        });
                    }
                }

                function createUserSignInFunction(){
                    return function (callback){

                        var SignInData = {
                            password: serviceAccount.pass,
                            username: serviceAccount.login
                        };

                        var serviceUrl = 'http://134.249.164.53:7788/signIn';

                        userCookiesObject = request.jar();
                        request.post(serviceUrl, { headers: {'User-Agent': 'Kofevarka'}, jar: userCookiesObject, json: true, body: SignInData }, function (err, res, body) {

                            if (!err && res.statusCode == 200) {

                                console.log(' ----------------------------------------------------------- User LogIn:',body);
                                userCookiesString = userCookiesObject.getCookieString(serviceUrl);
                                userCookies = userCookiesObject.getCookies(serviceUrl);
                                console.log('Cookies USER REQUEST:',userCookiesString );
                                return  callback(null,res.body)
                            }
                            return callback(err)
                        });
                    }
                }
            }
        }
    };

    function getUserById(userId, callback) {

        User
            .findOne({_id: userId})
            .select('login userType devices profile accounts')
            .exec(function (err, model) {
                if (err) {
                    return callback(err);
                }

                if (model) {
                    return callback(null, model);
                } else {
                    return callback(new Error(RESPONSE.ON_ACTION.NOT_FOUND + ' with such _id '));
                }
            });
    }

    function getServiceOptionsById(serviceId, callback) {

        Service
            .findOne({_id: serviceId})
            .exec(function (err, model) {
                if (err) {
                    return callback(err);
                }
                return callback(null, model);
            });
    }
};

module.exports = UserService;