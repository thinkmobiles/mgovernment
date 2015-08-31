/**
 * Provides ability for getting records of EmailReport for Admin
 *
 * @class adminEmailReport
 *
 */

var express = require('express');
var router = express.Router();

var EmailReport = require('../handlers/adminEmailReport');
var SessionHandler = require('../handlers/sessions');


module.exports = function(db) {
    'use strict';

    var emailReport = new EmailReport(db);
    var session = new SessionHandler(db);

    router.route('/')
        .get(session.isAdminBySession, emailReport.getAllEmailReports);

    router.route('/getCount/')
        .get(session.isAdminBySession, emailReport.getCount);

    return router;
};