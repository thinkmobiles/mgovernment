var CONST = require('../constants');
var ExportsCSV = require('../helpers/exportCSV');

var PoorCoverage = function (db) {
    'use strict';

    var mongoose = require('mongoose');
    var moment = require('moment');
    var poorCoverage = db.model(CONST.MODELS.POOR_COVERAGE);
    var exportCSV = new ExportsCSV();

    this.getAllCoverage = function (req, res, next) {

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
                $and:[{ $or: [ { 'address':  { $regex: searchTerm, $options: 'i' }}]}]
            };
        }

        poorCoverage
            .find(searchQuery)
            .sort(sortOrder)
            .skip(skipCount)
            .limit(limitCount)
            .populate({path: 'user', select: '_id login'})
            .exec(function (err, collection){
                if (err) {
                    return next(err);
                }

                res.status(200).send(collection);
            })
    };

    this.deleteCoverageById = function (req, res, next) {

        var id = req.params.id;

        poorCoverage
            .findByIdAndRemove(id, function (err, model){
                if (err) {
                    return next(err);
                }

                res.status(200).send({success: 'Success'});
            })

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
                $and:[{ $or: [ { 'address':  { $regex: searchTerm, $options: 'i' }}]}]
            };
        }

        poorCoverage
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
                        address: collection[i].address ? collection[i].address : '',
                        latitude: collection[i].location.latitude ? collection[i].location.latitude : '',
                        longitude: collection[i].location.latitude ? collection[i].location.latitude : '',
                        user: (collection[i].user && collection[i].user.login) ? collection[i].user.login : '',
                        firstName: (collection[i].user && collection[i].user.firstName) ? collection[i].user.firstName : '',
                        lastName: (collection[i].user && collection[i].user.lastName) ? collection[i].user.lastName : '',
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

                var fileName = 'poorCoverage' + moment().format('MMM Do YYYY') + (searchTerm ? searchTerm : '');
                var regFileName = fileName.replace(/\s+/g, '');

                exportCSV.tempCSVGenerator(res, exportData, regFileName);

            });
    };

    this.getCount = function (req, res, next) {

        var searchQuery = {};
        var searchTerm = req.query.searchTerm;

        if (searchTerm) {
            searchQuery = {
                $and:[{ $or: [ { 'address':  { $regex: searchTerm, $options: 'i' }}]}]
            };
        }

        poorCoverage
            .count(searchQuery, function (err, count) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({count: count});
            })
    };
};

module.exports = PoorCoverage;