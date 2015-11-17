var CONST = require('../constants');
var RESPONSE = require('../constants/response');
var HistoryHandler = require('./adminHistoryLog');

var EmailReport = function (db) {
    'use strict';

    var mongoose = require('mongoose');
    var ObjectId = mongoose.Types.ObjectId;
    var EmailReport = db.model(CONST.MODELS.EMAIL_REPORT);
    var adminHistoryHandler = new HistoryHandler(db);

    this.getAllEmailReports = function (req, res, next) {

        var sortField = req.query.orderBy || 'createdAt';
        var sortDirection = +req.query.order || 1;
        var skipCount = ((req.query.page - 1) * req.query.count) || 0;
        var limitCount = req.query.count || 20;
        var filter = req.query.filter ? req.query.filter.split(',') : [];
        var searchQuery = {};
        var searchTerm = req.query.searchTerm;
        var sortOrder = {};

        sortOrder[sortField] = sortDirection;

        if (searchTerm) {
            searchQuery = {
                $and:[{ $or: [ { 'title':  { $regex: searchTerm, $options: 'i' }}, { 'description':  { $regex: searchTerm, $options: 'i' }}]},{serviceType: {$nin: filter}}]
            };
        } else {
            searchQuery = {
                serviceType: {$nin: filter}
            }
        }

        EmailReport
            //.find({serviceType: {$nin: filter}})//nin - not in array, in - in array
            //.sort(sortOrder)
            //.skip(skipCount)
            //.limit(limitCount)
            ////.populate({path: 'service', select: '_id serviceProvider serviceName'})
            //.populate({path: 'user', select: '_id login'})
            //.allowDiskUse(true)
            //
            .find(searchQuery)//nin - not in array, in - in array
            .sort(sortOrder)
            .skip(skipCount)
            .limit(limitCount)
            //.populate({path: 'service', select: '_id serviceProvider serviceName'})
            .populate({path: 'user', select: '_id login'})
            .lean()
            .exec(function (err, collection) {
                if (err) {
                    return next(err);
                }

                return res.status(200).send(collection);
            });
    };

    this.deleteEmailReport = function (req, res, next) {

        var id = req.params.id;

        EmailReport
            .findByIdAndRemove({_id: id})
            .exec(function (err, model) {
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

                return res.status(200).send(model);
            });
    };

    this.getCount = function (req, res, next) {
        var filter = req.query.filter ? req.query.filter.split(',') : [];
        var searchQuery = {};
        var searchTerm = req.query.searchTerm;

        if (searchTerm) {
            searchQuery = {
                $and:[{ $or: [ { 'title':  { $regex: searchTerm, $options: 'i' }}, { 'description':  { $regex: searchTerm, $options: 'i' }}]},{serviceType: {$nin: filter}}]
            };
        } else {
            searchQuery = {
                serviceType: {$nin: filter}
            }
        }

        EmailReport
            .count(searchQuery, function (err, count) {
                if (err) {
                    return next(err);
                }
                return res.status(200).send({count: count});
            });
    };
};

module.exports = EmailReport;