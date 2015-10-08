var express = require('express');
var router = express.Router();

var UserInnovation = require('../handlers/userInnovation');
var SessionHandler = require('../handlers/sessions');

module.exports = function(db) {
    'use strict';

    var userInnovation = new UserInnovation(db);
    var session = new SessionHandler(db);

    router.route('/')
        .post(session.authenticatedUser, userInnovation.createInnovation)
        .get(session.authenticatedUser, userInnovation.getAllInnovations);

    return router;
};