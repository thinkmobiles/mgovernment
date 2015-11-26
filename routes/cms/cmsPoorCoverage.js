var express = require('express');
var router = express.Router();

var PoorCoverage = require('../../handlers/adminPoorCoverage');

module.exports = function(db){
    'use strict';

    var poorCoverage = new PoorCoverage(db);

    router.route('/')
        .get(poorCoverage.getAllCoverage);

    router.route('/:id')
        .delete(poorCoverage.deleteCoverageById);

    router.route('/getCount')
        .get(poorCoverage.getCount);

    router.route('/exportCSV')
        .get(poorCoverage.generateCsvData);

    return router;
};