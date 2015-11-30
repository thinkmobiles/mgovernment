var CONST = require('../constants');
var RESPONSE = require('../constants/response');
var HistoryHandler = require('./adminHistoryLog');
var ExportCSV = require('../helpers/exportCSV');

var Feedback = function(db) {
    'use strict';

    var mongoose = require('mongoose');
    var moment = require('moment');
    var ObjectId = mongoose.Types.ObjectId;
    var Feedback = db.model(CONST.MODELS.FEEDBACK);
    var adminHistoryHandler = new HistoryHandler(db);
    var exportCSV = new ExportCSV();

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

    this.deleteFeedback = function (req, res, next) {

        var searchQuery = {
            '_id': req.params.id
        };

        if (!searchQuery._id) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        Feedback
            .findByIdAndRemove(searchQuery)
            .exec(function (err, model) {
               if (err) {
                   return next(err);
               }

                var log = {
                    user: req.session.uId,
                    action: CONST.ACTION.DELETE,
                    model: CONST.MODELS.SERVICE,
                    modelId: req.params.id,
                    description: 'Delete Feedback'
                };
                adminHistoryHandler.pushlog(log);

                return res.status(200).send({success: RESPONSE.ON_ACTION.SUCCESS});
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

    this.generateCsvData = function (req, res, next) {

        var sortField = req.query.orderBy || 'createdAt';
        var sortDirection = +req.query.order || 1;
        var skipCount = ((req.query.page - 1) * req.query.count) || 0;
        var limitCount = req.query.count || 20;
        var sortOrder = {};
        var searchQuery = {};
        var searchTerm = req.query.searchTerm;

        sortOrder[sortField] = sortDirection;

        if (searchTerm) {
            searchQuery = {
                $and:[{ $or: [ { 'url':  { $regex: searchTerm, $options: 'i' }}, { 'description':  { $regex: searchTerm, $options: 'i' }}]}]
            };
        }

        Feedback
            .find(searchQuery)
            .sort(sortOrder)
            .skip(skipCount)
            .limit(limitCount)
            .populate({path: 'user', select: 'login profile.firstName profile.lastName'})
            .exec(function (err, collection) {
                if (err) {
                    return next(err);
                }

                var exportData = [];
                for (var i in collection) {
                    exportData.push({
                        serviceName: collection[i].serviceName ? collection[i].serviceName : '',
                        serviceProvider: collection[i].serviceProvider ? collection[i].serviceProvider : '',
                        user: (collection[i].user && collection[i].user.login) ? collection[i].user.login : 'UnAuthorized',
                        firstName: (collection[i].user && collection[i].user.firstName) ? collection[i].user.firstName : '',
                        lastName: (collection[i].user && collection[i].user.lastName) ? collection[i].user.lastName : '',
                        rate: collection[i].rate ? collection[i].rate : '',
                        feedback: collection[i].feedback ? collection[i].feedback : '',
                        createdAt: collection[i].createdAt ? (moment(collection[i].createdAt).format('l HH:mm')).toString() : ''
                    });
                }

                /*var cvsParams = {
                 columns: 'address latitude longitude user firstName lastName createdAt',
                 rows: exportData
                 };

                 var fileName = 'test3';

                 exportCSV.generateCsvData(cvsParams, function(err, csvData){
                 if (err) {
                 next(err);
                 } else {
                 exportCSV.sendCsvFile(res, fileName, csvData, function(err) {
                 if (err) {
                 next(err);
                 }
                 });
                 }
                 });*/

                var fileName = 'feedback' + moment().format('MMM Do YYYY') + (searchTerm ? searchTerm : '');
                var regFileName = fileName.replace(/\s+/g, '');

                exportCSV.tempCSVGenerator(res, exportData, regFileName);

            });
    };

};

module.exports = Feedback;