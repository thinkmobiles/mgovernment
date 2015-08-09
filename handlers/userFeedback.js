var CONST = require('../constants');
var RESPONSE = require('../constants/response');

var Feedback = function(db) {
    'use strict';

    var mongoose = require('mongoose');
    var ObjectId = mongoose.Types.ObjectId;
    var Feedback = db.model(CONST.MODELS.FEEDBACK);

    this.createFeedback = function(req, res, next) {
        var body = req.body;
        var feedback;

        if (!body) {
            return res.status(400).send({err: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        var userRef = (req.session && req.session.uId) ? new ObjectId(req.session.uId) : null;
        var serviceRef = new ObjectId(body.serviceId);

        var feedbackData = {
            user: userRef,
            service: serviceRef,
            rate: body.rate,
            feedback: body.feedback
        };

        feedback = new Feedback(feedbackData);

        feedback
            .save(function (err, model) {

                if (err) {
                    return next(err);
                }

                res.status(201).send(model);
            })
    };

    this.getAllFeedback = function(req, res, next) {

        var sortField = req.query.orderBy || 'createdAt';
        var sortDirection = +req.query.order || 1;
        var sortOrder = {};
        sortOrder[sortField] = sortDirection;

        var skipCount = ((req.query.page - 1) * req.query.count) || 0;
        var limitCount = req.query.count || 20;

        Feedback
            .find({})
            .sort(sortOrder)
            .skip(skipCount)
            .limit(limitCount)
            .populate({path: 'service', select: '_id serviceProvider serviceName'})
            .populate({path: 'user', select: '_id login profile.firstName profile.lastName'})
            .exec(function (err, collection) {
                if (err) {
                    return next(err);
                }

                return res.status(200).send(collection);
            });
    }
};

module.exports = Feedback;