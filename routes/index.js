var SessionHandler = require('../handlers/sessions');
var TestTRAHandler = require('../handlers/testTRAHandler');
var AttachmentHandler = require('../handlers/attachment');
var AccessHTTPHandler = require('../handlers/accessHTTP');

module.exports = function(app, db) {
    'use strict';

    var logWriter = require('../helpers/logWriter')();
    var models = require('../models/index')(db);

    var usersRouter = require('./users')(db);
    var servicesIcon = require('./servicesIcon')(db);
    var userServicesRouter = require('./userServices')(db);
    var userTraServicesRouter = require('./userTraServices')(db);
    var userFeedbackRouter = require('./userFeedback')(db);
    var userAttachmentRouter = require('./attachment')(db);
    var userAnnouncementRouter = require('./userAnnouncement')(db);
    var userInnovationRouter = require('./userInnovation')(db);
    var testTRAServicesRouter = require('./testTRAServices')(db);
    var whoIsAndMobileRouter = require('./whoIsAndMobile')(db);
    var crmRouter = require('./crmServices')(db);
    var cmsRouter = require('./cms/cms')(db);

    var session = new SessionHandler(db);
    var testTRAHandler = new TestTRAHandler(db);
    var attachmentHandler = new AttachmentHandler(db);
    var accessHTTP = new AccessHTTPHandler;

    app.get('/', function (req, res, next) {
        res.status(200).send('Express start succeed');
    });

    app.use('/cms', session.isAdminBySession, cmsRouter);
    app.use('/user', accessHTTP.appAccessHTTP, usersRouter);
    app.use('/icon', accessHTTP.appAccessHTTP, servicesIcon);
    app.use('/service', accessHTTP.appAccessHTTP, userServicesRouter);
    app.use('/feedback', accessHTTP.appAccessHTTP, userFeedbackRouter);
    app.use('/announcement', accessHTTP.appAccessHTTP, userAnnouncementRouter);
    app.use('/innovation', accessHTTP.appAccessHTTP, userInnovationRouter);
    app.use('/tra_api/service', accessHTTP.appAccessHTTP, userTraServicesRouter);
    app.get('/image/avatar', accessHTTP.appAccessHTTP, session.isAuthenticatedUser, attachmentHandler.getAttachmentBySession);
    app.get('/image/:imageId', accessHTTP.appAccessHTTP, session.isAdminBySession, attachmentHandler.getAttachmentById);
    app.use('/attachment', accessHTTP.appAccessHTTP, userAttachmentRouter);

    app.use('/', crmRouter);
    app.use('/', testTRAServicesRouter);
    app.use('/', whoIsAndMobileRouter);

    app.get('/', function (req, res) {
        res.sendfile('./index.html');
    });

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
            if (status === 401) {
                res.status(status).send({error: err.message});
            } else {
                res.status(status).send({error: err.message + '\n' + err.stack});
            }
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