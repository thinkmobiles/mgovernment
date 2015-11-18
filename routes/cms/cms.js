var express = require('express');
var router = express.Router();

module.exports = function(db) {
    'use strict';

    var userFeedbackRouter = require('./cmsFeedback')(db);
    var adminServicesRouter = require('./cmsService')(db);
    var adminHistoryRouter = require('./cmsHistoryLog')(db);
    var userHistoryRouter = require('./cmsUserHistoryLog')(db);
    var attachmentRouter = require('./cmsAttachment')(db);
    var innovationRouter = require('./cmsInnovation')(db);
    var emailReportRouter = require('./cmsEmailReport')(db);
    var servicesIcon = require('./cmsServicesIcon')(db);

    router.use('/feedback', userFeedbackRouter);
    router.use('/adminService', adminServicesRouter);
    router.use('/adminHistory', adminHistoryRouter);
    router.use('/userHistory', userHistoryRouter);
    router.use('/attachment', attachmentRouter);
    router.use('/innovation', innovationRouter);
    router.use('/emailReport', emailReportRouter);
    router.use('/icon', servicesIcon);

    return router;
};