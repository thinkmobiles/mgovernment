var express = require('express');
var UserServicesHandler = require('../handlers/userServices');
var AccessHandler = require('../handlers/accessHandler')

module.exports = function(db){

    var router = express.Router();
    var servicesHandler = new UserServicesHandler(db);
    var accessHandler = new AccessHandler(db);

    router.route('/:serviceId')
        .get(servicesHandler.getServiceOptions)
        .post(accessHandler.isAccessAvailable, servicesHandler.sendServiceRequest);

    return router;
};