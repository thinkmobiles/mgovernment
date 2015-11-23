var CONST = require('../constants');

var PoorCoverage = function (db) {
    'use strict';

    var mongoose = require('mongoose');
    var poorCoverage = db.model(CONST.MODELS.POOR_COVERAGE);

    this.getAllCoverage = function (req, res, next) {

        var sortField = req.query.orderBy || 'createdAt';
        var sortDirection = +req.query.order || 1;
        var skipCount = ((req.query.page - 1) * req.query.count) || 0;
        var limitCount = req.query.count || 20;
        var sortOrder = {};

        sortOrder[sortField] = sortDirection;

        poorCoverage
            .find()
            .sort(sortOrder)
            .skip(skipCount)
            .limit(limitCount)
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

                res.status(200).send({'delete': 'success'});
            })

    };

    this.getCount = function (req, res, next) {

        poorCoverage
            .count(function (err, count) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({count: count});
            })
    };
};

module.exports = PoorCoverage;