var express = require('express');
var router = express.Router();

var UserFeedback = require('../handlers/userFeedback');
var SessionHandler = require('../handlers/sessions');

module.exports = function(db) {
    'use strict';

    var userFeedback = new UserFeedback(db);
    var session = new SessionHandler(db);

    router.route('/')
        .post(userFeedback.createFeedback)
        .get(session.isAdminBySession, userFeedback.getAllFeedback);

    return router;
};