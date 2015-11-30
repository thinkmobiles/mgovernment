var express = require('express');
var router = express.Router();

var UserFeedback = require('../../handlers/userFeedback');

module.exports = function(db) {
    'use strict';

    var userFeedback = new UserFeedback(db);

    router.route('/')
        .get(userFeedback.getAllFeedback);

    router.route('/:id')
        .delete(userFeedback.deleteFeedback);

    router.route('/getCount')
        .get(userFeedback.getCount);

    router.route('/exportCSV')
        .get(userFeedback.generateCsvData);

    return router;
};
