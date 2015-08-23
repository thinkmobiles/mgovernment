/**
 * Provides the operation with services for __admin__ acount
 *
 * @class testTraServices
 *
 */

/**
 * This __method__ get information about domain name <br>
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

/**
 * This __method__ create complain about Poor Coverage <br>
 *
 * __URI:__ ___`/sendPoorCoverage`___
 *
 *  ## METHOD:
 * __POST__
 *
 *  ## Request:
 *     Body:
 *       address:
 *       location: {
 *          latitude:
 *          longitude:
 *       }
 *       signalLevel:
 *  ## Responses:
 *      status (200) JSON object: {object}
 *      status (400, 403, 500) JSON object: {error: 'Text about error'} or  {error: object}
 *
 * @method sendPoorCoverage
 * @for testTraServices
 */

var express = require( 'express' );
var router = express.Router();

var TestTRAHandler = require('../handlers/testTRAHandler');
var TestTRACRMHandler = require('../handlers/testTRACRMHandler');

module.exports = function(db) {
    'use strict';

    var testTRAHandler = new TestTRAHandler(db);
    var testTRACRMHandler = new TestTRACRMHandler(db);

    router.get('/checkWhois', testTRAHandler.testWhois);
    router.get('/checkWhoisAvailable', testTRAHandler.testWhoisCheck);
    router.get('/searchMobile', testTRAHandler.searchMobileImei);
    router.get('/searchMobileBrand', testTRAHandler.searchMobileBrand);
    router.post('/complainSmsSpam', testTRAHandler.complainSmsSpam);
    router.post('/complainSmsBlock', testTRAHandler.complainSmsBlock);

    router.post('/complainServiceProvider', testTRAHandler.complainServiceProvider);
    router.post('/complainTRAService', testTRAHandler.complainTRAService);

    router.post('/complainEnquiries', testTRAHandler.complainEnquiries);
    router.post('/sendSuggestion', testTRAHandler.sendSuggestion);
    router.post('/sendPoorCoverage', testTRAHandler.sendPoorCoverage);


    router.post('/sendHelpSalim', testTRAHandler.sendHelpSalim);
    //router.get('/crm/case', testTRACRMHandler.getCases);
    router.get('/crm/auth', testTRACRMHandler.loginHttp);
    router.get('/crm/auth/callback', testTRACRMHandler.authCallback);
    router.get('/crm/contacts', testTRACRMHandler.getContacts);

    return router;
};