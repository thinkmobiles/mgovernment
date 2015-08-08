var express = require('express');
var UserServicesHandler = require('../handlers/userServices');
var AccessHandler = require('../handlers/accessHandler');

module.exports = function(db){
    'use strict';

    var router = express.Router();
    var servicesHandler = new UserServicesHandler(db);
    var accessHandler = new AccessHandler(db);

    //router.route('/')
    //    .get(servicesHandler.getServices);

//    router.route('/dnslookup')
//        .post(servicesHandler.sendServiceRequest);
//
//    router.route('/getdevicebrandmodel/:brendName/:searchModelName')
//        .post(servicesHandler.sendServiceRequest);
//
//    router.route('/getdevicemodel/all/:searchModelName')
//        .post(servicesHandler.sendServiceRequest);
//
//    router.route('/isfakedevice')
//        .post(servicesHandler.sendServiceRequest);
//
//    router.route('/signalcoverage')
//        .post(servicesHandler.sendServiceRequest);
//
//    router.route('/blockwebsite')
//        .post(servicesHandler.sendServiceRequest);
//
//    router.route('/servicerating')
//        .post(servicesHandler.sendServiceRequest);
//
//    router.route('/insertsmsspam')
//        .post(servicesHandler.sendServiceRequest);
//
//router.route('/taggedsearch/:searchString')
//        .post(servicesHandler.sendServiceRequest);

    return router;
};