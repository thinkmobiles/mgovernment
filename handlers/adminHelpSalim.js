var CONST = require('../constants');
var ExportCSV = require('../helpers/exportCSV');

var HelpSalim = function (db) {
    'use strict';

    var mongoose = require('mongoose');
    var moment = require('moment');
    var helpSalim = db.model(CONST.MODELS.HELP_SALIM);
    var exportCSV = new ExportCSV();

    this.getAllSalim = function (req, res, next) {

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

        helpSalim
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

    this.deleteSalimById = function (req, res, next) {

        var id = req.params.id;

        helpSalim
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
                $and:[{ $or: [ { 'url':  { $regex: searchTerm, $options: 'i' }}, { 'description':  { $regex: searchTerm, $options: 'i' }}]}]
            };
        }

        helpSalim
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
                        url: collection[i].url ? collection[i].url : '',
                        description: collection[i].description ? collection[i].description : '',
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
                $and:[{ $or: [ { 'url':  { $regex: searchTerm, $options: 'i' }}, { 'description':  { $regex: searchTerm, $options: 'i' }}]}]
            };
        }

        helpSalim
            .count(searchQuery, function (err, count) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({count: count});
            })
    };
};

module.exports = HelpSalim;