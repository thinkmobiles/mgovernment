var express = require('express');
var router = express.Router();

var UserHandler = require('../../handlers/users');

module.exports = function (db) {
    'use strict';

    var users = new UserHandler(db);

    router.route('/')
        .post(users.createAccount)
        .get(users.getUserProfiles);

    router.route('/getCount/')
        .get(users.getCount);

    router.route('/:id')
        .get(users.getUserProfileByIdForAdmin)
        .put(users.updateAccount)
        .delete(users.deleteUserProfileByIdForAdmin);

    return router;
};