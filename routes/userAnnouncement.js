var express = require('express');
var router = express.Router();

var UserAnnouncement = require('../handlers/announcement');
var SessionHandler = require('../handlers/sessions');

module.exports = function(db) {
    'use strict';

    var userAnnouncement = new UserAnnouncement(db);
    var session = new SessionHandler(db);

    router.route('/')
        .get(session.authenticatedUser, userAnnouncement.getAllAnnouncements);

    router.route('/count')
        .get(session.authenticatedUser, userAnnouncement.getCount);

    return router;
};