var express = require('express');
var router = express.Router();

var ServicesHandler = require('../../handlers/adminServices');

module.exports = function(db) {

    'use strict';

    var servicesHandler = new ServicesHandler(db);

    router.route('/')
        .post(servicesHandler.createService)

        .get(servicesHandler.getServices);

    router.route('/getCount')
        .get(servicesHandler.getCount);

    router.route('/:id')
        .put(servicesHandler.updateServiceById)

        .get(servicesHandler.getServiceById)

        .delete(servicesHandler.deleteServiceById);

    return router;
};