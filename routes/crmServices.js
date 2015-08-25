'use strict';

var express = require('express');
var router = express.Router();
var UserHandler = require('../handlers/users');
var SessionHandler = require('../handlers/sessions');
var CrmNetWrapperHandler = require('../handlers/crmNetWrapper/testCrmNetWrapper');

module.exports = function(db) {

    var users = new UserHandler(db);
    var session = new SessionHandler(db);
    var crmNetWrapperHandler = new CrmNetWrapperHandler(db);

    router.post('/signIn', crmNetWrapperHandler.signInClient);
    router.post('/register', crmNetWrapperHandler.registerClient);
    router.post('/signOut', crmNetWrapperHandler.signOutClient);

    router.post('/complainSmsSpam', session.authenticatedUser, crmNetWrapperHandler.complainInquiries);
    router.post('/complainServiceProvider', crmNetWrapperHandler.complainServiceProvider);
    router.post('/complainTRAService', crmNetWrapperHandler.complainTRAService);
    router.post('/complainEnquiries', crmNetWrapperHandler.complainInquiries);
    router.post('/sendSuggestion', crmNetWrapperHandler.sendSuggestion);

//    router.post('/complainSmsBlock', crmNetWrapperHandler.complainSmsBlock);
//    router.post('/sendPoorCoverage', crmNetWrapperHandler.sendPoorCoverage);
//    router.post('/sendHelpSalim', crmNetWrapperHandler.sendHelpSalim);

    return router;
};