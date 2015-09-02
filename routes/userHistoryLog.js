/**
 * Provides ability for getting records of userHistoryLog for Admin
 *
 * @class userHistoryLog
 *
 */

var express = require('express');
var router = express.Router();

var UserHistoryLog = require('../handlers/userHistoryLog');

module.exports = function(db) {
    'use strict';

    var userHistoryLog = new UserHistoryLog(db);

    router.route('/')
        .get(userHistoryLog.getAllRecords);

    router.route('/getCount/')
        .get(userHistoryLog.getCount);

    return router;
};