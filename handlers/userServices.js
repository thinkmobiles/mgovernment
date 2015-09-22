var CONST = require('../constants');
var RESPONSE = require('../constants/response');
var UserHistoryHandler = require('./userHistoryLog');
var Capalaba = require('./apiWrappers/capalaba');
var TmaTraServices = require('./apiWrappers/tmaTraServices');
var tmaTraServicesViaSocket = require('./apiWrappers/tmaTraServicesViaSocket');

var SessionHandler = require('./sessions');
var async = require('async');
var mongoose = require('mongoose');

var UserService = function(db) {
    'use strict';

    var Service = db.model(CONST.MODELS.SERVICE);
    var session = new SessionHandler(db);
    var User = db.model(CONST.MODELS.USER);

    var serviceWrappers =  {};
    serviceWrappers[CONST.SERVICE_PROVIDERS.CAPALABA] = new Capalaba(db);
    serviceWrappers[CONST.SERVICE_PROVIDERS.TMA_TRA_SERVICES] = new TmaTraServices(db);
    serviceWrappers[CONST.SERVICE_PROVIDERS.TMA_TRA_SERVICES_VIA_SOCKET] = new tmaTraServicesViaSocket(db);

    var userHistoryHandler = new UserHistoryHandler(db);

    this.getServiceOptions = function (req, res, next) {

        var searchQuery = {
            _id: req.params.serviceId
        };

        getServiceOptionsById(searchQuery, function (err, model) {

            var log = {
                user: req.session.uId || null,
                action: CONST.ACTION.GET,
                model: CONST.MODELS.SERVICE,
                modelId: searchQuery._id,
                req: {params: req.params, body: req.params},
                res: model,
                description: 'getServiceOptions'
            };
            userHistoryHandler.pushlog(log);

            if (err) {
                return res.status(400).send({error: 'Service Option not found'});
            }
            return res.status(200).send(model);
        })
    };

    this.getServiceInfo = function (req, res, next) {
        // TODO check this when session.language will be implemented
        var language = req.session.language ? req.session.language : 'EN';
        var id =  req.params.serviceId;

        Service
            .findOne({_id: id})
            .select('serviceName.' + language +' icon profile inputItems buttonTitle.' + language + ' serviceDescription')
            .lean()
            .exec( function (err, model) {
                var responseModel = model;
                var tempObject;

                var log = {
                    user: req.session.uId || null,
                    action: CONST.ACTION.GET,
                    model: CONST.MODELS.SERVICE,
                    modelId: id,
                    req: {params: req.params, body: req.params},
                    res: 'collection',
                    description: 'getServiceInfo'
                };
                userHistoryHandler.pushlog(log);

                if (err) {
                    return res.status(500).send({error: err});
                }
                console.dir(responseModel);
                responseModel.icon = responseModel.icon ? '/icon/' + responseModel.icon : null;
                responseModel.serviceName = responseModel.serviceName[language];
                responseModel.serviceDescription = responseModel.serviceDescription[language];
                responseModel.buttonTitle = responseModel.buttonTitle[language];

                for (var i = responseModel.inputItems.length - 1; i >= 0; i --){
                    for (var j = i - 1; j >= 0; j --){
                        if (responseModel.inputItems[i].order < responseModel.inputItems[j].order) {
                            tempObject = responseModel.inputItems[i];
                            responseModel.inputItems[i] = responseModel.inputItems[j];
                            responseModel.inputItems[j] = tempObject;
                        }
                    }
                }

                for (var i = responseModel.inputItems.length - 1; i >= 0; i --){
                   delete(responseModel.inputItems[i].order);
                   delete(responseModel.inputItems[i]._id);
                    responseModel.inputItems[i].displayName = responseModel.inputItems[i].displayName[language];
                    responseModel.inputItems[i].placeHolder = responseModel.inputItems[i].placeHolder[language];
                }

                return res.status(200).send(responseModel);
            })
    };

    this.getServices = function (req, res, next) {
        // TODO check this when session.language will be implemented
        var language = req.session.language ? req.session.language : 'EN';

        Service
            .find()
            .select('_id serviceName.' + language +' icon ')
            .lean()
            .exec(function (err, collection) {
                var log;
                var responseCollection = collection;

                if (err) {
                    return res.status(500).send({error: err});
                }

                log = {
                    user: req.session.uId || null,
                    action: CONST.ACTION.GET,
                    model: CONST.MODELS.SERVICE,
                    modelId: '',
                    req: {params: req.params, body: req.params},
                    res: collection,
                    description: 'Get Services'
                };

                userHistoryHandler.pushlog(log);

                for (var i = responseCollection.length - 1; i >= 0; i --){
                    responseCollection[i].icon = responseCollection[i].icon ? '/icon/' + responseCollection[i].icon : null;
                    responseCollection[i].serviceName = responseCollection[i].serviceName[language];
                }

                return res.status(200).send(responseCollection);
            });
    };

    this.getServiceNames = function (req, res, next) {

        Service
            .find()
            .select('-_id serviceName')
            .exec(function (err, collection) {
                var result = [];
                var log;

                if (err) {
                    return next(err);
                }

                log = {
                    user: req.session.uId || null,
                    action: CONST.ACTION.GET,
                    model: CONST.MODELS.SERVICE,
                    modelId: '',
                    req: {params: req.params, body: req.params},
                    res: collection,
                    description: 'Get Services Names'
                };
                userHistoryHandler.pushlog(log);

                for (var i = collection.length-1; i >= 0; i--){
                    result.push(collection[i].serviceName);
                }

                //TODO this is  RIGHT response but at now mobile need static array[] of servicesNames. Change back.

                //return res.status(200).send(result);

                //TODO this is temporary solution.
                return res.status(200).send(["complain Poor Coverage", "complain about TRA Service", "complain about Service Provider", "complain Enquiries", "complain Suggestion", "Rating service", "Help Salim", "SMS Spam Block", "SMS Spam Report", "Search Device By BrandName", "Search Device By Imei", "Check Domain Availability", "Get Domain Data"]);
            });
    };

    this.sendServiceRequest = function (req, res, next) {

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
        tasks.push(createChooseProviderAndSendRequest());

        /// Async main process service Handlers
        async.waterfall(tasks, function (err,results){
            if (err) {
                return res.status(400).send({error: err});
            }

            var log = {
                user: req.session.uId || null,
                action: CONST.ACTION.POST,
                model: CONST.MODELS.SERVICE,
                modelId: serviceId,
                req: {params: req.params, body: req.body},
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
                    return callback(null, serviceOptions.params.needUserAuth);
                })
            };
        }

        function createChooseProviderAndSendRequest() {
            return function (callback) {

                var specificService = serviceWrappers[serviceOptions.serviceProvider];

                specificService.sendRequest(serviceOptions, serviceAccount,req, userId, function (err, result)
                {
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, result);
                });
            };
        }

        function createGetServiceAccesOptionsFunction() {
            return function (needUserAuth, callback) {

                if (!needUserAuth || !userId) {
                    return callback();
                }

                getUserById(userId, function (err, user) {
                    user = user.toJSON();

                    for (var i = user.accounts.length - 1; i >= 0; i--) {
                        if (user.accounts[i].serviceProvider === serviceOptions.serviceProvider) {
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