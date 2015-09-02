/**
 * Provides ability for getting records of userFeedback for Admin, and create Feedback for user
 *
 * @class userFeedback
 *
 */

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

    router.route('/getCount/')
        .get(session.isAdminBySession, userFeedback.getCount);

    return router;
};