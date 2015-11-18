var express = require('express');
var router = express.Router();

var UserFeedback = require('../handlers/userFeedback');
var ServicesHandler = require('../handlers/adminServices');
var AdminHistoryLog = require('../handlers/adminHistoryLog');
var UserHistoryLog = require('../handlers/userHistoryLog');
var AttachmentHandler = require('../handlers/attachment');
var UserInnovation = require('../handlers/userInnovation');
var EmailReport = require('../handlers/adminEmailReport');

module.exports = function(db) {
    'use strict';

    var userFeedback = new UserFeedback(db);
    var servicesHandler = new ServicesHandler(db);
    var adminHistoryLog = new AdminHistoryLog(db);
    var userHistoryLog = new UserHistoryLog(db);
    var attachmentHandler = new AttachmentHandler(db);
    var userInnovation = new UserInnovation(db);
    var emailReport = new EmailReport(db);

// ------- Feedback -------
    router.route('/feedback')
        .get(userFeedback.getAllFeedback);
    router.route('/feedback/:id')
        .delete(userFeedback.deleteFeedback);
    router.route('/feedback/getCount')
        .get(userFeedback.getCount);

// ------- Service -------
    router.route('/adminService')
        .post(servicesHandler.createService)
        .get(servicesHandler.getServices);
    router.route('/adminService/hub')
        .post(servicesHandler.createServiceHub);
    router.route('/adminService/getCount')
        .get(servicesHandler.getCount);
    router.route('/adminService/:id')
        .put(servicesHandler.updateServiceById)
        .get(servicesHandler.getServiceById)
        .delete(servicesHandler.deleteServiceById);

// ------- Admin History Log -------
    router.route('/adminHistory')
        .get(adminHistoryLog.getAllRecords);
    router.route('/adminHistory/getCount')
        .get(adminHistoryLog.getCount);

// ------- User History Log -------
    router.route('/userHistory')
        .get(userHistoryLog.getAllRecords);
    router.route('/userHistory/getCount')
        .get(userHistoryLog.getCount);

// ------- Attachment -------
    router.route('/attachment/:id')
        .delete(attachmentHandler.removeAttachment);

// ------- User Innovation -------
    router.route('/innovation')
        .post(userInnovation.createInnovation);
    router.route('/innovation/:id')
        .put(userInnovation.editInnovationsById)
        .get(userInnovation.getInnovationsById)
        .delete(userInnovation.deleteInnovationsById);

// ------- Email Report -------
    router.route('/emailReport')
        .get(emailReport.getAllEmailReports);
    router.route('/emailReport/:id')
        .delete(emailReport.deleteEmailReport);
    router.route('/emailReport/getCount')
        .get(emailReport.getCount);

    return router;
};