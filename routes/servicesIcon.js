/**
 * Provides ability  CRUD Service for Admin
 *
 * @class adminServices
 *
 */

var express = require( 'express' );
var ServicesIcon = require('../handlers/servicesIcon');
var SessionHandler = require('../handlers/sessions');


module.exports = function(db){
    'use strict';

    var router = express.Router();
    var servicesIcon = new ServicesIcon(db);
    var session = new SessionHandler(db);

    router.route('/')
        .post(session.isAdminBySession, servicesIcon.createServicesIcon)
        .get(servicesIcon.getServicesIcons);

    router.route('/getCount/')
        .get(servicesIcon.getCount);

    router.route('/:id/:type')
        .get(servicesIcon.getServicesIconByIdAndType);

    router.route('/base64/:id/:type')
        .get(servicesIcon.getServicesIconBase64ByIdAndType);

    router.route('/:id')
        .put(servicesIcon.updateServicesIconById)
        .get(servicesIcon.getServicesIconById)
        .delete(servicesIcon.deleteServicesIcon);

    return router;
};