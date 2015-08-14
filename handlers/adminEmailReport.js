var CONST = require('../constants');
var RESPONSE = require('../constants/response');

var EmailReport = function(db) {
    'use strict';

    var mongoose = require('mongoose');
    var ObjectId = mongoose.Types.ObjectId;
    var EmailReport = db.model(CONST.MODELS.EMAIL_REPORT);

     this.getAllEmailReports = function (req, res, next) {

        var sortField = req.query.orderBy || 'createdAt';
        var sortDirection = +req.query.order || 1;
        var sortOrder = {};
        sortOrder[sortField] = sortDirection;

        var skipCount = ((req.query.page - 1) * req.query.count) || 0;
        var limitCount = req.query.count || 20;
        var filter = req.query.filter ? req.query.filter.split(',') : [];
        console.log('sortOrder:',sortOrder);

        EmailReport
            .find({serviceType: {$nin: filter}})//nin - not in array, in - in array
            .sort(sortOrder)
            .skip(skipCount)
            .limit(limitCount)
            //.populate({path: 'service', select: '_id serviceProvider serviceName'})
            .populate({path: 'user', select: '_id login'})
            .allowDiskUse(true)
            .exec(function (err, collection) {
                if (err) {
                    return next(err);
                }

                return res.status(200).send(collection);
            });
    };

    this.getCount = function (req, res, next) {
        var filter = req.query.filter ? req.query.filter.split(',') : [];

        EmailReport
            .count({serviceType: {$nin: filter}}, function (err, count) {
                if (err) {
                    return next(err);
                }
                return res.status(200).send({count: count});
            });
    };
};

module.exports = EmailReport;