/**
 * Provides the operation with services for __admin__ account
 *
 * @class testTraServices
 *
 */

var express = require( 'express' );
var router = express.Router();

var WhoIsAndMobileHandler = require('../handlers/whoIsAndMobileHandler');


module.exports = function(db) {
    'use strict';

    var whoIsAndMobileHandler = new WhoIsAndMobileHandler(db);

    /**
     * This __method__ get information about domain name
     *
     * __URI:__ ___`/checkWhois`___
     *
     *  ## METHOD:
     * __GET__
     *
     *  ## Request:
     *     Query: checkUrl
     *     Exemple: /checkWhois?checkUrl=tra.gov.ae
     *
     *  ## Responses:
     *      status (200) JSON object: {object}
     *      status (400, 403, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     *
     * @example
     *     {
 *      Domain Name: 'tra.gov.ae',
 *      Registrar ID: 'Etisalat',
 *      Registrar Name:  'Etisalat',
 *      Status: 'ok'
 *    }
     * @method testWhois
     * @for testTraServices
     */
    router.get('/checkWhois', whoIsAndMobileHandler.testWhois);
    router.get('/checkWhoisAvailable', whoIsAndMobileHandler.testWhoisCheck);
    router.get('/searchMobile', whoIsAndMobileHandler.searchMobileImei);
    router.get('/searchMobileBrand', whoIsAndMobileHandler.searchMobileBrand);
    return router;
};