var express = require('express');
var UserServicesHandler = require('../handlers/userServices');
var AccessHandler = require('../handlers/accessHandler');

module.exports = function(db){
    'use strict';

    var router = express.Router();
    var servicesHandler = new UserServicesHandler(db);
    var accessHandler = new AccessHandler(db);

    router.route('/')
        .get(servicesHandler.getServices);

    router.route('/serviceNames')
        .get(servicesHandler.getServiceNames);


    router.route('/:serviceId')
        .get(servicesHandler.getServiceOptions)
        .post(accessHandler.isAccessAvailable, servicesHandler.sendServiceRequest);

    return router;
};