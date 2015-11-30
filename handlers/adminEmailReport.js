var CONST = require('../constants');
var RESPONSE = require('../constants/response');
var HistoryHandler = require('./adminHistoryLog');
var ExportCSV = require('../helpers/exportCSV');

var EmailReport = function (db) {
    'use strict';

    var mongoose = require('mongoose');
    var moment = require('moment');
    var ObjectId = mongoose.Types.ObjectId;
    var EmailReport = db.model(CONST.MODELS.EMAIL_REPORT);
    var adminHistoryHandler = new HistoryHandler(db);
    var exportCSV = new ExportCSV();

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

                return res.status(200).send({success: 'Success'});
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

    this.generateCsvData = function (req, res, next) {

        var filter = req.query.filter ? req.query.filter.split(',') : [];
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
                $and:[{ $or: [ { 'title':  { $regex: searchTerm, $options: 'i' }}, { 'description':  { $regex: searchTerm, $options: 'i' }}]},{serviceType: {$nin: filter}}]
            };
        } else {
            searchQuery = {
                serviceType: {$nin: filter}
            }
        }

        EmailReport
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
                        serviceType: collection[i].serviceType ? collection[i].serviceType : '',
                        serviceProvider: collection[i].serviceProvider ? collection[i].serviceProvider : '',
                        user: (collection[i].user && collection[i].user.login) ? collection[i].user.login : 'UnAuthorized',
                        firstName: (collection[i].user && collection[i].user.firstName) ? collection[i].user.firstName : '',
                        lastName: (collection[i].user && collection[i].user.lastName) ? collection[i].user.lastName : '',
                        title: collection[i].title ? collection[i].title : '',
                        description: collection[i].description ? collection[i].description : '',
                        mailTo: collection[i].mailTo ? collection[i].mailTo : '',
                        createdAt: collection[i].createdAt ? (moment(collection[i].createdAt).format('l HH:mm')).toString() : '',
                        response: collection[i].response ? (collection[i].response.message ? collection[i].response.message : collection[i].response) : ''
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

                var fileName = 'emailReport' + moment().format('MMM Do YYYY') + (searchTerm ? searchTerm : '');
                var regFileName = fileName.replace(/\s+/g, '');

                exportCSV.tempCSVGenerator(res, exportData, regFileName);

            });
    };

};

module.exports = EmailReport;