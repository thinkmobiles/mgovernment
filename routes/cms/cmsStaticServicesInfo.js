var express = require('express');
var router = express.Router();
var StaticServicesInfo = require('../../handlers/adminStaticServicesInfo');

module.exports = function(db) {
    'use strict';

    var staticServicesInfo = new StaticServicesInfo(db);

    router.route('/')
        .get(staticServicesInfo.getAllServicesInfo);

    router.route('/getCount')
        .get(staticServicesInfo.getCount);

    router.route('/:id')
        .get(staticServicesInfo.getServiceById)
        .put(staticServicesInfo.updateServiceByEdit);

    return router;
};