var express = require('express');
var router = express.Router();

var ServiceIcon = require('../../handlers/servicesIcon');

module.exports = function(db) {
    'use strict';

    var servicesIcon = new ServiceIcon(db);

    router.route('/')
        .post(servicesIcon.createServicesIcon)

        .get(servicesIcon.getServicesIcons);

    router.route('/getCount/')
        .get(servicesIcon.getCount);

    router.route('/:id')
        .put(servicesIcon.updateServicesIconById)

        .get(servicesIcon.getServicesIconById)

        .delete(servicesIcon.deleteServicesIcon);

    return router;
};