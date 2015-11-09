var CONST = require('../constants');
var RESPONSE = require('../constants/response');
var UserHistoryHandler = require('./userHistoryLog');
var Capalaba = require('./apiWrappers/capalaba');
var TmaTraServices = require('./apiWrappers/tmaTraServices');
var tmaTraServicesViaSocket = require('./apiWrappers/tmaTraServicesViaSocket');
var SERVICES_INFO = require('../constants/traServicesInfo');

var SessionHandler = require('./sessions');
var async = require('async');
var mongoose = require('mongoose');

var UserService = function(db) {
    'use strict';

    var Service = db.model(CONST.MODELS.SERVICE);
    var session = new SessionHandler(db);
    var User = db.model(CONST.MODELS.USER);

    var serviceWrappers =  {};
    serviceWrappers[CONST.SERVICE_PROVIDERS.DEFAULT_REST] = new TmaTraServices(db);
    serviceWrappers[CONST.SERVICE_PROVIDERS.TEST_TRA_SOCKET] = new tmaTraServicesViaSocket(db);

    var userHistoryHandler = new UserHistoryHandler(db);

    this.getServiceOptions = function (req, res, next) {

        Service
            .findOne({_id: req.params.serviceId})
            .select('_id enable serviceName pages needAuth icon buttonTitle')
            .lean()
            .exec(function (err, model) {

                if (err || !model) {
                    return res.status(400).send({error: 'Service Option not found'});
                }

                model.icon = model.icon ? '/icon/' + model.icon : null;

                return res.status(200).send(model);
            });
    };

    this.getServiceOptionsCms = function (req, res, next) {

        var searchQuery = {
            _id: req.params.serviceId
        };

        getServiceOptionsById(searchQuery, function (err, model) {

            if (err) {
                return res.status(400).send({error: 'Service Option not found'});
            }

            return res.status(200).send(model);
        })
    };

    this.getServiceInfo = function (req, res, next) {
        // TODO check this when session.language will be implemented
        var language = req.query.lang ? req.query.lang : (req.session.language ? req.session.language : 'EN');
        var id =  req.params.serviceId;
        //console.log('lang: ',req.query.lang);
        //
        //console.dir(req.session);

        if (req.query.lang) {
                      req.session.language = req.query.lang;
        }

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

                if (!responseModel) {
                    return res.status(404).send({error: RESPONSE.ON_ACTION.NOT_FOUND});
                }

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

        Service
            .find()
            .select('_id serviceName icon needAuth')
            .lean()
            .exec(function (err, collection) {
                var log;
                var responseCollection = collection;

                if (err) {
                    return res.status(500).send({error: err});
                }

                for (var i = responseCollection.length - 1; i >= 0; i --){
                    responseCollection[i].icon = responseCollection[i].icon ? '/icon/' + responseCollection[i].icon : null;
                }

                return res.status(200).send(responseCollection);
            });
    };

    this.getServiceNames = function (req, res, next) {

        var lang = req.query.lang ? req.query.lang.toUpperCase() : 'EN';

        if (!(lang === 'EN' || lang === 'AR')) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS + ' language: AR or EN'});
        }

        var serviceNames = [];
        var serviceInfos = SERVICES_INFO[lang];

        for(var serviceInfo in serviceInfos) {
            serviceNames.push(serviceInfos[serviceInfo].Name);
        }

        return res.status(200).send(serviceNames);
    };

    this.getServiceAbout = function(req, res, next) {

        var serviceName = req.query.name;
        var lang = req.query.lang ? req.query.lang.toUpperCase() : 'EN';

        if (!serviceName) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        if (!(lang === 'EN' || lang === 'AR')) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS + ' language: AR or EN'});
        }

        serviceName = serviceName.toLowerCase();

        var serviceInfo = SERVICES_INFO[lang][serviceName];

        if (!serviceInfo) {
            return res.status(404).send({error: RESPONSE.NOT_FOUND});
        }

        return res.status(200).send(serviceInfo);
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

                    if (serviceOptions.params.needUserAuth) {
                        console.log('serviceOptions.params.needUserAuth= ',serviceOptions.params.needUserAuth)

                    }
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