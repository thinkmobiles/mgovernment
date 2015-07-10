var CONST = require('../constants');
var RESPONSE = require('../constants/response');
var UserHistoryHandler = require('./userHistoryLog');
var Capalaba = require('./apiWrappers/capalaba');
var SessionHandler = require('./sessions');
var async = require('async');
var mongoose = require('mongoose');

var UserService = function(db) {
    'use strict';

    var Service = db.model(CONST.MODELS.SERVICE);
    var session = new SessionHandler(db);
    var User = db.model(CONST.MODELS.USER);
    var capalaba = new Capalaba(db);


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

        var userRequestBody = req.body;
        var userId = req.session.uId;
        var serviceId = req.params.serviceId;
        var found = false;
        var foundNumber = -1;
        var serviceOptions;
        var serviceAccount;
        var tasks =[];

        /// GET SERVICE Options BY ID
        tasks.push(createGetServiceOptionsFunction());

        /// GET UserAccountFor Service by session id
        tasks.push(createGetServiceAccesOptionsFunction());

        /// Outside Server process Handler
        //tasks.push(capalaba.createSendDataToCapalabaFunction(serviceOptions, serviceAccount, userRequestBody, userId));
        tasks.push(capalaba.createSendDataToCapalabaFunction());

        /// Async main process service Handlers
        async.waterfall(tasks, function (err,results){
            if (err) {
                return res.status(400).send(err);
            }

            var log = {
                userId: req.session.uId || 'Unauthorized',
                action: CONST.ACTION.POST,
                model: CONST.MODELS.SERVICE,
                modelId: serviceId,
                req: {params: req.params, userRequestBody: req.params},
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
                    return callback(null, serviceOptions);
                })
            };
        }

        function createGetServiceAccesOptionsFunction() {
            return function (arg1, callback) {

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
                    return callback(null, serviceOptions, serviceAccount, userRequestBody, userId);
                });
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