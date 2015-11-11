var CONST = require('../constants');
var RESPONSE = require('../constants/response');

var Feedback = function(db) {
    'use strict';

    var mongoose = require('mongoose');
    var ObjectId = mongoose.Types.ObjectId;
    var Feedback = db.model(CONST.MODELS.FEEDBACK);

    this.createFeedback = function (req, res, next) {
        var body = req.body;
        var feedback;

        if (!body || !body.rate || !body.feedback || (!body.serviceId && !body.serviceName)) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        var validation = require('../helpers/validation');
        var userRef = (req.session && req.session.uId) ? new ObjectId(req.session.uId) : null;
        var serviceRef = (body.serviceId) ? new ObjectId(body.serviceId) : null;
        var rate = body.rate;
        var errors = [];

        var feedbackData = {
            user: userRef,
            service: serviceRef,
            serviceName: body.serviceName,
            rate: rate,
            feedback: body.feedback
        };

        validation.checkRate15(errors, true, rate, 'Rate');
        if (errors.length) {
            return res.status(400).send({error: errors});
        }

        if (! /^[12345]$/.test(rate)) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        feedback = new Feedback(feedbackData);

        feedback
            .save(function (err, model) {
                if (err) {
                    return next(err);
                }
                return res.status(201).send(model);
            })
    };

    this.getAllFeedback = function (req, res, next) {

        var sortField = req.query.orderBy || 'createdAt';
        var sortDirection = +req.query.order || 1;
        var sortOrder = {};
        sortOrder[sortField] = sortDirection;

        var findParams = {};
        var search = req.query.search ? req.query.search : null;
        if (search) {
            findParams = {
                $or: [
                    {feedback: new RegExp(search, 'i')}
                ]
            };

        }

        var skipCount = ((req.query.page - 1) * req.query.count) || 0;
        var limitCount = req.query.count || 20;

        Feedback
            .find(findParams)
            .sort(sortOrder)
            .skip(skipCount)
            .limit(limitCount)
            .populate({path: 'service', select: '_id serviceProvider serviceName'})
            .populate({path: 'user', select: '_id login'})
            .exec(function (err, collection) {
                if (err) {
                    return next(err);
                }

                return res.status(200).send(collection);
            });
    };

    this.getCount = function (req, res, next) {

        Feedback
            .count({}, function (err, count) {
                if (err) {
                    return next(err);
                }
                return res.status(200).send({count: count});
            });
    };
};

module.exports = Feedback;