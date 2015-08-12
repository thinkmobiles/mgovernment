var express = require( 'express' );
var router = express.Router();

var TestTRAHandler = require('../handlers/testTRAHandler');
var TestTRACRMHandler = require('../handlers/testTRACRMHandler');

module.exports = function(db) {
    'use strict';

    var testTRAHandler = new TestTRAHandler(db);
    var testTRACRMHandler = new TestTRACRMHandler(db);

    router.get('/checkWhois', testTRAHandler.testWhois);
    router.get('/checkWhoisAvailable', testTRAHandler.testWhoisCheck);
    router.get('/searchMobile', testTRAHandler.searchMobileImei);
    router.get('/searchMobileBrand', testTRAHandler.searchMobileBrand);
    router.post('/complainSmsSpam', testTRAHandler.complainSmsSpam);
    router.post('/complainServiceProvider', testTRAHandler.complainServiceProvider);
    router.post('/sendHelpSalim', testTRAHandler.sendHelpSalim);

    //router.get('/crm/case', testTRACRMHandler.getCases);
    router.get('/crm/auth', testTRACRMHandler.loginHttp);
    router.get('/crm/auth/callback', testTRACRMHandler.authCallback);
    router.get('/crm/contacts', testTRACRMHandler.getContacts);

    return router;
};