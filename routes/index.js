var SessionHandler = require('../handlers/sessions');
var TestTRAHandler = require('../handlers/testTRAHandler');

module.exports = function(app, db){
    'use strict';

    var logWriter = require('../helpers/logWriter')();
    var models = require('../models/index')(db);

    var usersRouter = require('./users')(db);
    var clientLayoutsRouter = require('./clientLayouts')(db);
    var adminLayoutsRouter = require('./adminLayouts')(db);
    var adminServicesRouter = require('./adminServices')(db);
    var userServicesRouter = require('./userServices')(db);
    var userTraServicesRouter = require('./userTraServices')(db);

    var session = new SessionHandler(db);
    var testTRAHandler = new TestTRAHandler(db);

    app.get('/', function(req, res, next){
        res.status(200).send('Express start succeed');
    });

    app.get('/checkWhois', function(req, res, next) {
        testTRAHandler.testWhois(req, res, next);
    });

    app.get('/checkWhoisAvailable', function(req, res, next) {
        testTRAHandler.testWhoisCheck(req, res, next);
    });

    app.get('/searchMobile', function(req, res, next) {
        testTRAHandler.searchMobileImei(req, res, next);
    });

    app.get('/searchMobileBrand', function(req, res, next) {
        testTRAHandler.searchMobileBrand(req, res, next);
    });

    app.use('/user', usersRouter);
    app.use('/clientLayout', clientLayoutsRouter);
    app.use('/adminLayout',session.isAdminBySession, adminLayoutsRouter);
    app.use('/adminService',session.isAdminBySession, adminServicesRouter);
    app.use('/service', userServicesRouter);
    app.use('/tra_api/service', userTraServicesRouter);
    app.get('/', function(req, res){
        res.sendfile('./index.html');
    });

    function notFound(req, res, next){
        next();
    }

    function errorHandler( err, req, res, next ) {
        var status = err.status || 500;

        if (process.env.NODE_ENV === 'production') {
            if (status === 404 || status === 401) {
                logWriter.log('', err.message + '\n' + err.stack);
            }
            res.status(status);
        } else {
            if (status !== 401) {
                logWriter.log('', err.message + '\n' + err.stack);
            }
            res.status(status).send(err.message + '\n' + err.stack);
        }

        if (status === 401) {
            console.warn(err.message);
        } else {
            console.error(err.message);
            console.error(err.stack);
        }
    }

    app.use( notFound );
    app.use( errorHandler );
};