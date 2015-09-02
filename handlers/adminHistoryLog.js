var CONST = require('../constants');
var RESPONSE = require('../constants/response');

var HistoryHandler = function(db) {
    'use strict';

    var mongoose = require('mongoose');
    var AdminHistory = db.model(CONST.MODELS.ADMIN_HISTORY);

    this.pushlog = function(log) {
        var adminHistory = new AdminHistory(log);
        adminHistory
            .save(function (err, user) {
                if (err) {
                    return res.status(500).send(err)
                }
            });
    };

    this.getAllRecords = function (req, res, next) {

        var sortField = req.query.orderBy || 'createdAt';
        var sortDirection = +req.query.order || 1;
        var skipCount = ((req.query.page - 1) * req.query.count) || 0;
        var limitCount = req.query.count || 20;
        var sortOrder = {};

        sortOrder[sortField] = sortDirection;

        AdminHistory
            .find({})
            .sort(sortOrder)
            .skip(skipCount)
            .limit(limitCount)
            //.populate({path: 'service', select: '_id serviceProvider serviceName'})
            .populate({path: 'user', select: '_id login'})
            .exec(function (err, collection) {
                if (err) {
                    return next(err);
                }

                return res.status(200).send(collection);
            });
    };

    this.getCount = function (req, res, next) {

        AdminHistory
            .count({}, function (err, count) {
                if (err) {
                    return next(err);
                }
                return res.status(200).send({count: count});
            });
    };
};

module.exports = HistoryHandler;