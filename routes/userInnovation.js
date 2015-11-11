var express = require('express');
var router = express.Router();

var UserInnovation = require('../handlers/userInnovation');
var SessionHandler = require('../handlers/sessions');

module.exports = function(db) {
    'use strict';

    var userInnovation = new UserInnovation(db);
    var session = new SessionHandler(db);

    router.route('/')
        .post(session.isAuthenticatedUser, userInnovation.createInnovation)
        .get(session.isAuthenticatedUser, userInnovation.getAllInnovations);

    router.route('/admin')
        .get(session.isAdminBySession, userInnovation.getInnovations)
        .post(session.isAdminBySession, userInnovation.createInnovation)
        .put(session.isAdminBySession, userInnovation.editInnovations)
        .delete(session.isAdminBySession, userInnovation.deleteInnovations);

    return router;
};