var CONST = require('../constants');

var HelpSalim = function (db) {
    'use strict';

    var mongoose = require('mongoose');
    var helpSalim = db.model(CONST.MODELS.HELP_SALIM);

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