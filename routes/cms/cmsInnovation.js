var express = require('express');
var router = express.Router();

var UserInnovation = require('../../handlers/userInnovation');

module.exports = function(db) {
    'use strict';

    var userInnovation = new UserInnovation(db);

    router.route('/')
        .post(userInnovation.createInnovation);

    router.route('/:id')
        .put(userInnovation.editInnovationsById)

        .get(userInnovation.getInnovationsById)

        .delete(userInnovation.deleteInnovationsById);

    return router;
};
