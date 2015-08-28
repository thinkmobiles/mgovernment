/**
 * Provides ability for getting Services, information about services
 *
 * @class userServices
 *
 */

var express = require('express');
var UserServicesHandler = require('../handlers/userServices');
var AccessHandler = require('../handlers/accessHandler');

module.exports = function(db){
    'use strict';

    var router = express.Router();
    var servicesHandler = new UserServicesHandler(db);
    var accessHandler = new AccessHandler(db);

    /**
     * This __method__ get user all Services
     *
     * __URI:__ ___`/service`___
     *
     *  ## METHOD:
     * __GET__
     *
     *
     *  ## Responses:
     *      status (200) JSON Array of object: {[object]}
     *      status (400, 500) JSON object: {error: 'Text about error'} or  {error: object}

     *
     * @method getServices
     * @for userServices
     * @memberOf userServices
     *
     */

    router.route('/')
        .get(servicesHandler.getServices);

    /**
     * This __method__ get user all Services Name
     *
     * __URI:__ ___`/service/serviceNames`___
     *
     *  ## METHOD:
     * __GET__
     *
     *
     *  ## Responses:
     *      status (200) JSON Array of string: {[string]}
     *      status (400, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     * @example
     *      {
     *      ["complain Poor Coverage", "complain about TRA Service", "complain about Service Provider",
     *      "complain Enquiries", "complain Suggestion", "Rating service", "Help Salim", "SMS Spam Block",
     *      "SMS Spam Report", "Search Device By BrandName", "Search Device By Imei", "Check Domain Availability",
     *      "Get Domain Data"]
     *      }
     *
     * @method getServiceNames
     * @for userServices
     * @memberOf userServices
     */

    router.route('/serviceNames')
        .get(servicesHandler.getServiceNames);


    router.route('/:serviceId')
        .get(servicesHandler.getServiceOptions)
        .post(accessHandler.isAccessAvailable, servicesHandler.sendServiceRequest);

    return router;
};