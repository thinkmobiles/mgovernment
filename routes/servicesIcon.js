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

    router.route('/:id/:type')
        .get(servicesIcon.getServicesIconByIdAndType);

    router.route('/base64/:id/:type')
        .get(servicesIcon.getServicesIconBase64ByIdAndType);

    return router;
};
