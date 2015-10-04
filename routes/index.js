var SessionHandler = require('../handlers/sessions');
var TestTRAHandler = require('../handlers/testTRAHandler');
var AttachmentHandler = require('../handlers/attachment');

module.exports = function(app, db) {
    'use strict';

    var logWriter = require('../helpers/logWriter')();
    var models = require('../models/index')(db);

    var usersRouter = require('./users')(db);
    var clientLayoutsRouter = require('./clientLayouts')(db);
    var adminLayoutsRouter = require('./adminLayouts')(db);
    var adminServicesRouter = require('./adminServices')(db);
    var adminHistoryLogRouter = require('./adminHistoryLog')(db);
    var userHistoryLogRouter = require('./userHistoryLog')(db);
    var userServicesRouter = require('./userServices')(db);
    var userTraServicesRouter = require('./userTraServices')(db);
    var userFeedbackRouter = require('./userFeedback')(db);
    var adminEmailReports = require('./adminEmailReport')(db);
    var testTRAServicesRouter = require('./testTRAServices')(db);
    var whoIsAndMobileRouter = require('./whoIsAndMobile')(db);
    var crmRouter = require('./crmServices')(db);

    var session = new SessionHandler(db);
    var testTRAHandler = new TestTRAHandler(db);
    var attachmentHandler = new AttachmentHandler(db);

    app.get('/', function (req, res, next) {
        res.status(200).send('Express start succeed');
    });

    app.use('/user', usersRouter);
    app.use('/clientLayout', clientLayoutsRouter);
    app.use('/adminLayout', session.isAdminBySession, adminLayoutsRouter);
    app.use('/adminService', session.isAdminBySession, adminServicesRouter);
    app.use('/adminHistory', session.isAdminBySession, adminHistoryLogRouter);
    app.use('/userHistory', session.isAdminBySession, userHistoryLogRouter);
    app.use('/service', userServicesRouter);
    app.use('/feedback', userFeedbackRouter);
    app.use('/emailReport', adminEmailReports);
    app.use('/tra_api/service', userTraServicesRouter);
    app.get('/attachment/:attachmentId', session.isAdminBySession, attachmentHandler.getAttachmentById);

    app.use('/', crmRouter);
    app.use('/', testTRAServicesRouter);
    app.use('/', whoIsAndMobileRouter);

    app.get('/', function (req, res) {
        res.sendfile('./index.html');
    });

    //app.get('/attachment/:attachmentId', session.isAdminBySession, function (req, res) {
    //    res.send('test <img style="width:10px; height:10px; border: 1px solid black"> Hello');
    //});

    function notFound(req, res, next) {
        next();
    }

    function errorHandler(err, req, res, next) {
        var status = err.status || 500;

        if (process.env.NODE_ENV === 'production') {
            if (status === 404 || status === 401) {
                logWriter.log('', err.message + '\n' + err.stack);
            }
            res.status(status).send({error: err.message});
        } else {
            if (status !== 401) {
                logWriter.log('', err.message + '\n' + err.stack);
            }
            res.status(status).send({error: err.message + '\n' + err.stack});
        }

        if (status === 401) {
            console.warn(err.message);
        } else {
            console.error(err.message);
            console.error(err.stack);
        }
    }

    app.use(notFound);
    app.use(errorHandler);
};