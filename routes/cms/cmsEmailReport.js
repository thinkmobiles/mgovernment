/**
 * Provides ability for getting records of EmailReport for Admin
 *
 * @class adminEmailReport
 *
 */

var express = require('express');
var router = express.Router();

var EmailReport = require('../../handlers/adminEmailReport');

module.exports = function(db) {
    'use strict';

    var emailReport = new EmailReport(db);

    router.route('/')
        .get(emailReport.getAllEmailReports);

    router.route('/:id')
        .delete(emailReport.deleteEmailReport);

    router.route('/getCount/')
        .get(emailReport.getCount);

    return router;
};