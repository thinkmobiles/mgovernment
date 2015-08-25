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
     *      }
     *
     * @method testWhois
     *
     */
    router.get('/checkWhois', whoIsAndMobileHandler.testWhois);

    /**
     * This __method__ get information if the domain is available
     *
     * __URI:__ ___`/checkWhoisAvailable`___
     *
     *  ## METHOD:
     * __GET__
     *
     *  ## Request:
     *     Query: checkUrl
     *     Exemple: /checkWhoisAvailable?checkUrl=tra.gov.ae
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
     *      }
     *
     * @method checkWhoisAvailable
     *
     */

    router.get('/checkWhoisAvailable', whoIsAndMobileHandler.testWhoisCheck);

    /**
     * This __method__ get information about phone by IMEI or TAC code
     *
     * __URI:__ ___`/searchMobile`___
     *
     *  ## METHOD:
     * __GET__
     *
     *  ## Request:
     *     Query: imei
     *     Exemple: /searchMobile?imei=01385100
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
     *      }
     *
     * @method searchMobile
     *
     */
    router.get('/searchMobile', whoIsAndMobileHandler.searchMobileImei);

    /**
     * This __method__ get information about phones by Brand
     *
     * __URI:__ ___`/searchMobileBrand`___
     *
     *  ## METHOD:
     * __GET__
     *
     *  ## Request:
     *     Query: brand
     *     Exemple: /searchMobileBrand?brand=Apple
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
     *      }
     *
     * @method searchMobileBrand
     *
     */

    router.get('/searchMobileBrand', whoIsAndMobileHandler.searchMobileBrand);
    return router;
};