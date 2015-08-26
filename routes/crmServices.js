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

    router.post('/crm/signIn', crmNetWrapperHandler.signInClient);
    router.post('/crm/register', crmNetWrapperHandler.registerClient);
    router.post('/crm/signOut', crmNetWrapperHandler.signOutClient);

    router.post('/complainSmsSpam', session.authenticatedUser, crmNetWrapperHandler.complainSmsSpam);
    router.post('/complainServiceProvider', session.authenticatedUser, crmNetWrapperHandler.complainServiceProvider);
    router.post('/complainTRAService', session.authenticatedUser, crmNetWrapperHandler.complainTRAService);
    router.post('/complainEnquiries', session.authenticatedUser, crmNetWrapperHandler.complainInquiries);
    router.post('/sendSuggestion', session.authenticatedUser, crmNetWrapperHandler.sendSuggestion);

    return router;
};