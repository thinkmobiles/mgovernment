var express = require('express');
var UserServicesHandler = require('../handlers/userServices');

module.exports = function(db){

    var router = express.Router();
    var servicesHandler = new UserServicesHandler(db);

    router.route('/:provider/:service')
        .get(servicesHandler.getServiceOptions)
        .post(servicesHandler.sendServiceRequest);

    return router;
};