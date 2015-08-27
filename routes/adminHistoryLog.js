var express = require('express');
var router = express.Router();

var AdminHistoryLog = require('../handlers/adminHistoryLog');

module.exports = function(db) {
    'use strict';

    var adminHistoryLog = new AdminHistoryLog(db);

    router.route('/')
        .get(adminHistoryLog.getAllRecords);

    router.route('/getCount/')
        .get(adminHistoryLog.getCount);

    return router;
};