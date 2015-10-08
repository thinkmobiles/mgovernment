var CONST = require('../constants');
var RESPONSE = require('../constants/response');

var InnovationHandler = function(db) {
    'use strict';

    var mongoose = require('mongoose');
    var ObjectId = mongoose.Types.ObjectId;
    var Innovation = db.model(CONST.MODELS.INNOVATION);

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

                return res.status(201).send(model);
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