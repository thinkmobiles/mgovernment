var CONST = require('../constants');
var RESPONSE = require('../constants/response');
var UserHistoryHandler = require('./userHistoryLog');


var UserService = function(db) {

    var mongoose = require('mongoose');
    var Service = db.model(CONST.MODELS.SERVICE);
    var userHistoryHandler = new UserHistoryHandler(db);

    this.getServiceOptions = function(req, res, next) {

        var searchQuery = {
            _id: req.params.serviceId
        };

        Service
            .find(searchQuery)
            .exec(function (err, model) {
                if (err) {
                    return next(err);
                }

                var log = {
                    userId: req.session.uId || 'Unauthorized',
                    action: CONST.ACTION.GET,
                    model: CONST.MODELS.SERVICE,
                    modelId: searchQuery._id,
                    req: {params: req.params, body: req.params},
                    res:model,
                    description: 'getServiceOptions'
                };
                userHistoryHandler.pushlog(log);
                return res.status(200).send(model);
            });
    };

    this.getServices = function(req, res, next) {

        Service
            .find()
            .select( 'serviceProvider serviceName serviceType profile forUserType method baseUrl')
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
                    res:collection,
                    description: 'getServices'
                };
                userHistoryHandler.pushlog(log);

                return res.status(200).send(collection);
            });
    };

    this.sendServiceRequest = function(req, res, next) {

        var log = {
            userId: req.session.uId || 'Unauthorized',
            action: CONST.ACTION.POST,
            model: CONST.MODELS.SERVICE,
            modelId:'',
            req: {params: req.params, body: req.params},
            res:{},
            description: 'sendServiceRequest'
        };
        userHistoryHandler.pushlog(log);
        return res.status(200).send({success: RESPONSE.ON_ACTION.SUCCESS});
    };
};

module.exports = UserService;