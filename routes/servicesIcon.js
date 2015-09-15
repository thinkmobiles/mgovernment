/**
 * Provides ability  CRUD Service for Admin
 *
 * @class adminServices
 *
 */

var express = require( 'express' );
var ServicesIcon = require('../handlers/servicesIcon');

module.exports = function(db){
    'use strict';

    var router = express.Router();
    var servicesIcon = new ServicesIcon(db);

    router.route('/')
        .post(servicesIcon.createServicesIcon)
        .get(servicesIcon.getServicesIcons);

    //router.route('/getCount/')
    //    .get(servicesIcon.getCount);
    router.route('/:id/:type')
        .get(servicesIcon.getServicesIconByIdAndType);

    router.route('/:id')
        .put(servicesIcon.updateServicesIconServicesID)
        .get(servicesIcon.getServicesIconById)
        .delete(servicesIcon.deleteServicesIcon);

    return router;
};
