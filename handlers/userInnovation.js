var CONST = require('../constants');
var RESPONSE = require('../constants/response');
var HistoryHandler = require('./adminHistoryLog');

var InnovationHandler = function(db) {
    'use strict';

    var mongoose = require('mongoose');
    var ObjectId = mongoose.Types.ObjectId;
    var Innovation = db.model(CONST.MODELS.INNOVATION);
    var User = db.model(CONST.MODELS.USER);
    var adminHistoryHandler = new HistoryHandler(db);

    this.createInnovation = function (req, res, next) {
        var body = req.body;
        var innovation;

        if (!body || !body.title || !body.message || !body.type) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        if (! /^[123456]$/.test(body.type)) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS + ': type'});
        }

        var userRef =  new ObjectId(req.session.uId);

        innovation = new Innovation({
            title: body.title,
            message: body.message,
            type: body.type,
            user: userRef
        });

        innovation
            .save(function (err, model) {
                if (err) {
                    return next(err);
                }

                getUserTypeById(userRef, function (err, userType) {
                    if (userType === CONST.USER_TYPE.ADMIN) {

                        var log = {
                            user: req.session.uId,
                            action: CONST.ACTION.CREATE,
                            model: CONST.MODELS.SERVICE,
                            modelId: req.params.id,
                            description: 'Create Innovation'
                        };

                        adminHistoryHandler.pushlog(log);
                    }
                });

                return res.status(201).send(model);
            })
    };

    function getUserTypeById(userId, callback) {

        User
            .findOne({'_id': userId})
            .exec(function (err, model) {
                if (err) {
                    return callback(err);
                }
                if (model) {
                    return callback(null, model.userType);
                } else {
                    return callback(new Error(RESPONSE.ON_ACTION.NOT_FOUND));
                }
            });
    }

    this.editInnovationsById = function (req, res, next) {

        var body = req.body;
        var id = req.params.id;
        var data = {};

        if (!body.title || !body.message || !body.type) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        if (!/^[123456]$/.test(body.type)) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS + ': type'});
        }

        if (body.title) {
            data.title = body.title;
        }

        if (body.message) {
            data.message = body.message;
        }

        if (body.type) {
            data.type = body.type;
        }

        Innovation
            .findByIdAndUpdate({_id: id}, {$set: data}, function(err, model) {
                if (err) {
                    return next(err);
                }

                var log = {
                    user: req.session.uId,
                    action: CONST.ACTION.UPDATE,
                    model: CONST.MODELS.SERVICE,
                    modelId: req.params.id,
                    description: 'Edit Innovation'
                };
                adminHistoryHandler.pushlog(log);

                return res.status(200).send(model);
            });
    };

    this.deleteInnovationsById = function (req, res, next) {
        
        var id = req.params.id;

        Innovation
            .findByIdAndRemove({_id: id}, function (err, model) {
                if (err) {
                    return next(err);
                }

                var log = {
                    user: req.session.uId,
                    action: CONST.ACTION.DELETE,
                    model: CONST.MODELS.SERVICE,
                    modelId: req.params.id,
                    description: 'Delete Innovation'
                };
                adminHistoryHandler.pushlog(log);

                return res.status(200).send({success: RESPONSE.ON_ACTION.SUCCESS});
            });
    };

    this.getInnovationsById = function (req, res, next) {

        var id = req.params.id;

        Innovation
            .findById({_id: id}, function (err, model) {
                if (err) {
                    return next(err);
                }
                if (model === null) {

                    return res.status(404).send(model);
                } else {

                    return res.status(200).send(model);
                }
            })
    };

    this.getAllInnovations = function (req, res, next) {

        var sortField = req.query.orderBy || 'createdAt';
        var sortDirection = +req.query.order || 1;
        var sortOrder = {};
        sortOrder[sortField] = sortDirection;

        var skipCount = req.query.offset || 0;
        var limitCount = req.query.limit || 20;

        Innovation
            .find({})
            .sort(sortOrder)
            .skip(skipCount)
            .limit(limitCount)
            .populate({path: 'user', select: '_id login profile.firstName profile.lastName'})
            .exec(function (err, collection) {
                if (err) {
                    return next(err);
                }

                return res.status(200).send(collection);
            });
    };

};

module.exports = InnovationHandler;