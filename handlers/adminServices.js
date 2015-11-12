var CONST = require('../constants');
var RESPONSE = require('../constants/response');
var HistoryHandler = require('./adminHistoryLog');

var Service = function(db) {
    'use strict';

    var mongoose = require('mongoose');
    var logWriter = require('../helpers/logWriter')();
    var Service = db.model(CONST.MODELS.SERVICE);
    var adminHistoryHandler = new HistoryHandler(db);
    var validation = require('../helpers/validation');

    function checkReceivedParamsFieldNamesWithItemsNames(receivedArray, arrayToCompareName) {
        var foundEqualFieldName = false;

        for (var i = receivedArray.length - 1; i >= 0; i--) {
            foundEqualFieldName = false;

            for (var j = arrayToCompareName.length - 1; j >= 0; j--) {

                for (var m = arrayToCompareName[j].inputItems.length - 1; m >= 0; m--) {

                    if (receivedArray[i] === arrayToCompareName[j].inputItems[m].name) {
                        foundEqualFieldName = true;
                    }
                }
            }
            if (!foundEqualFieldName) {
                return false;
            }
        }
        return true;
    }

    this.updateServiceById = function (req, res, next) {

        var searchQuery = {
            '_id': req.params.id
        };
        var body = req.body;
        var errors =[];

        if (!body) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        validation.checkUrlField(errors, true, body.url, 'Url');

        if (errors.length) {
            return res.status(400).send({error: errors});
        }

        if (body.params.body && !checkReceivedParamsFieldNamesWithItemsNames(body.params.body, body.pages)) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }
        if (body.params.query && !checkReceivedParamsFieldNamesWithItemsNames(body.params.query, body.pages)) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }
        if (body.params.uriSpecQuery && !checkReceivedParamsFieldNamesWithItemsNames(body.params.uriSpecQuery, body.pages)) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        body.url = body.url.charAt(body.url.length-1) === '/' ? body.url : body.url + '/';
        body.url = body.url.replace(/^\/+|\/+$/g,'');

        body.updatedAt = new Date();

        Service
            .findOneAndUpdate(searchQuery, body, function (err, model) {

                if (err) {
                    return next(err);
                }
                var log = {
                    user: req.session.uId,
                    action: CONST.ACTION.UPDATE,
                    model: CONST.MODELS.SERVICE,
                    modelId: searchQuery._id,
                    description: 'Update Service by _id'
                };
                adminHistoryHandler.pushlog(log);
                res.status(200).send(model);
            });
    };

    this.createService = function (req, res, next) {

        var body = req.body;
        var service;
        var errors =[];

        if (!body) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        validation.checkUrlField(errors, true, body.url, 'url');

        if (errors.length) {
            return res.status(400).send({error: errors});
        }

        if (body.params.body && !checkReceivedParamsFieldNamesWithItemsNames(body.params.body, body.pages)) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }
        if (body.params.query && !checkReceivedParamsFieldNamesWithItemsNames(body.params.query, body.pages)) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }
        if (body.params.uriSpecQuery && !checkReceivedParamsFieldNamesWithItemsNames(body.params.uriSpecQuery, body.pages)) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        body.url = body.url.charAt(body.url.length-1) === '/' ? body.url : body.url + '/';
        body.url = body.url.replace(/^\/+|\/+$/g,'');

        body.updatedAt = new Date();
        service = new Service(body);

        service
            .save(function (err, model) {

                if (err) {
                    return next(err);
                }

                var log = {
                    user: req.session.uId,
                    action: CONST.ACTION.CREATE,
                    model: CONST.MODELS.SERVICE,
                    modelId: model._id,
                    description: 'Create new Service'
                };
                adminHistoryHandler.pushlog(log);

                res.status(201).send(model.toJSON());
            })
    };

    this.getServiceById = function (req, res, next) {
        var id = req.params.id;

        if (!id) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        Service
            .findById(id)
            .exec(function (err, model) {
                if (err) {
                    return res.status(500).send({error: err});
                }

                if (!model) {
                    return res.status(404).send({error: RESPONSE.ON_ACTION.NOT_FOUND});
                }
                return res.status(200).send(model.toJSON());
            });


        //findServiceByQuery(searchQuery, function (err, model) {
        //
        //    if (err) {
        //        return next(err);
        //    }
        //
        //    return res.status(200).send(model.toJSON());
        //})
    };

    this.deleteServiceById = function (req, res, next) {
        var searchQuery = {
            '_id': req.params.id
        };

        if (!searchQuery._id) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        Service
            .findOne(searchQuery)
            .remove()
            .exec(function (err, model) {

                if (err) {
                    return next(err);
                }

                var log = {
                    user: req.session.uId,
                    action: CONST.ACTION.DELETE,
                    model: CONST.MODELS.SERVICE,
                    modelId: req.params.id,
                    description: 'Delete Service'
                };
                adminHistoryHandler.pushlog(log);

                return res.status(200).send({success: RESPONSE.ON_ACTION.SUCCESS});
            });
    };


    this.getServices = function (req, res, next) {

        var sortField = req.query.orderBy || 'createdAt';
        var sortDirection = +req.query.order || 1;
        var skipCount = ((req.query.page - 1) * req.query.count) || 0;
        var limitCount = req.query.count || 20;
        var sortOrder = {};
        sortOrder[sortField] = sortDirection;

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