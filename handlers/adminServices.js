var CONST = require('../constants');
var RESPONSE = require('../constants/response');
var HistoryHandler = require('./historyLog');

var Service = function(db) {
    'use strict';

    var mongoose = require('mongoose');
    var logWriter = require('../helpers/logWriter')();
    var Service = db.model(CONST.MODELS.SERVICE);
    var Layout = db.model(CONST.MODELS.LAYOUT);
    var historyHandler = new HistoryHandler(db);

    function checkRecivedParamsFieldNamesWithItemsNames(recivedArray,arrayTocompareName){
        var foundEqualFieldName = false;

        for (var i = recivedArray.length - 1; i >= 0; i--) {
            for (var j = arrayTocompareName.length -1; j >= 0; j --) {
                if (recivedArray[i] === arrayTocompareName[j].name){
                    foundEqualFieldName = true;
                }
            }
            if (!foundEqualFieldName) {
                return false
            }
            foundEqualFieldName = false;
        }
        return true;
    }

    this.updateServiceById = function (req, res, next) {

        var searchQuery = {
            '_id': req.params.id
        };

        var body = req.body;
        var myRegExp =/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;

        if (!body) {
            return res.status(400).send({err: RESPONSE.NOT_ENOUGH_PARAMS});
        }
        if (!myRegExp.test(body.baseUrl)) {
            return res.status(400).send({err: RESPONSE.NOT_ENOUGH_PARAMS});
        }
        if (body.params.body && !checkRecivedParamsFieldNamesWithItemsNames(body.params.body, body.inputItems)) {
            return res.status(400).send({err: RESPONSE.NOT_ENOUGH_PARAMS});
        }
        if (body.params.query && !checkRecivedParamsFieldNamesWithItemsNames(body.params.query, body.inputItems)) {
            return res.status(400).send({err: RESPONSE.NOT_ENOUGH_PARAMS});
        }
        if (body.params.uriSpecQuery && !checkRecivedParamsFieldNamesWithItemsNames(body.params.uriSpecQuery, body.inputItems)) {
            return res.status(400).send({err: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        body.baseUrl = body.baseUrl.charAt(body.baseUrl.length-1) === '/' ? body.baseUrl : body.baseUrl + '/';
        body.url = body.url.replace(/^\/+|\/+$/g,'');

        body.updatedAt = new Date();

        Service
            .findOneAndUpdate(searchQuery, body, function (err, model) {

                if (err) {
                    return next(err);
                }
                var log = {
                    userId: req.session.uId,
                    action: CONST.ACTION.UPDATE,
                    model: CONST.MODELS.SERVICE,
                    modelId: searchQuery._id,
                    description: 'Update Service by _id'
                };
                historyHandler.pushlog(log);
                res.status(200).send({success: model});
            });
    };



    this.createService = function (req, res, next) {

        var body = req.body;
        var service;
        var myRegExp =/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;

        if (!body) {
            return res.status(400).send({err: RESPONSE.NOT_ENOUGH_PARAMS});
        }
        if (!myRegExp.test(body.baseUrl)) {
            return res.status(400).send({err: RESPONSE.NOT_ENOUGH_PARAMS});
        }
        if (body.params.body && !checkRecivedParamsFieldNamesWithItemsNames(body.params.body, body.inputItems)) {
            return res.status(400).send({err: RESPONSE.NOT_ENOUGH_PARAMS});
        }
        if (body.params.query && !checkRecivedParamsFieldNamesWithItemsNames(body.params.query, body.inputItems)) {
            return res.status(400).send({err: RESPONSE.NOT_ENOUGH_PARAMS});
        }
        if (body.params.uriSpecQuery && !checkRecivedParamsFieldNamesWithItemsNames(body.params.uriSpecQuery, body.inputItems)) {
            return res.status(400).send({err: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        body.baseUrl = body.baseUrl.charAt(body.baseUrl.length-1) === '/' ? body.baseUrl : body.baseUrl + '/';
        body.url = body.url.replace(/^\/+|\/+$/g,'');

        body.updatedAt = new Date();
        service = new Service(body);

        service
            .save(function (err, model) {

                if (err) {
                    return next(err);
                }

                var log = {
                    userId: req.session.uId,
                    action: CONST.ACTION.CREATE,
                    model: CONST.MODELS.SERVICE,
                    modelId: model._id,
                    description: 'Create new Service'
                };
                historyHandler.pushlog(log);
                res.status(200).send({success: model.toJSON()});
            })
    };

    this.getServiceById = function (req, res, next) {
        var searchQuery = {
            '_id': req.params.id
        };

        if (!searchQuery._id) {
            return res.status(400).send({err: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        findServiceByQuery(searchQuery, function (err, model) {

            if (err) {
                return next(err);
            }

            return res.status(200).send(model.toJSON());
        })
    };

    this.deleteServiceById = function (req, res, next) {
        var searchQuery = {
            '_id': req.params.id
        };

        if (!searchQuery._id) {
            return res.status(400).send({err: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        Service
            .findOne(searchQuery)
            .remove()
            .exec(function (err, model) {

                if (err) {
                    return next(err);
                }

                return res.status(200).send({result: RESPONSE.ON_ACTION.SUCCESS});
            });
    };


    this.getServices = function (req, res, next) {

        var sortField = req.query.orderBy || 'createdAt';
        var sortDirection = +req.query.order || 1;
        var sortOrder = {};
        sortOrder[sortField] = sortDirection;
        var skipCount = ((req.query.page - 1) * req.query.count) || 0;
        var limitCount = req.query.count || 20;

        Service
            .find({})
            .sort(sortOrder)
            .skip(skipCount)
            .limit(limitCount)
            .exec(function (err, collection) {
                if (err) {
                    return next(err);
                }
                return res.status(200).send(collection);
            });
    };

    this.getCount = function (req, res, next) {

        Service
            .count({}, function (err, count) {
                if (err) {
                    return next(err);
                }
                return res.status(200).send({count: count});
            });
    };

    function findServiceByQuery(Query, callback) {

        Service
            .findOne(Query)
            .exec(function (err, model) {
                if (err) {
                    return callback(err);
                }

                if (!model) {
                    var err = new Error(RESPONSE.ON_ACTION.NOT_FOUND + Query);
                    err.status = 404;
                    return callback(err);
                }
                return callback(null, model);
            });
    }
};

module.exports = Service;