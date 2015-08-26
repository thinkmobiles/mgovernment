/**
 * Provides the operation with services for __admin__ account
 *
 * @class testTraServices
 *
 */

var express = require( 'express' );
var router = express.Router();

var TestTRAHandler = require('../handlers/testTRAHandler');
var TestTRACRMHandler = require('../handlers/testTRACRMHandler');

module.exports = function(db) {
    'use strict';

    var testTRAHandler = new TestTRAHandler(db);
    var testTRACRMHandler = new TestTRACRMHandler(db);

    /**
     * This __method__ create SMS Spam Report
     *
     * __URI:__ ___`/complainSmsSpam`___
     *
     *  ## METHOD:
     * __POST__
     *
     *  ## Request:
     *     Body:
     *      phone: from whom spam
     *      description: text
     *
     *  ## Responses:
     *      status (200) JSON object: {object}
     *      status (400, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     * @method complainSmsSpam
     * @for testTraServices
     */

    router.post('/complainSmsSpam', testTRAHandler.complainSmsSpam);
    /**
     * This __method__ create SMS Spam Block
     *
     * __URI:__ ___`/complainSmsBlock`___
     *
     *  ## METHOD:
     * __POST__
     *
     *  ## Request:
     *     Body:
     *      phone: from whom spam
     *      phoneProvider: provider number
     *      providerType: elesat or du
     *      description: text
     *
     *  ## Responses:
     *      status (200) JSON object: {object}
     *      status (400, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     * @method complainSmsBlock
     * @for testTraServices
     */

    router.post('/complainSmsBlock', testTRAHandler.complainSmsBlock);
    /**
     * This __method__ create complain about Service Provider
     *
     * __URI:__ ___`/complainServiceProvider`___
     *
     *  ## METHOD:
     * __POST__
     *
     *  ## Request:
     *     Body:
     *      title:
     *      serviceProvider:
     *      description:
     *      referenceNumber: // '12312412'
     *      attachment: // optional img in Base64
     *
     *  ## Responses:
     *      status (200) JSON object: {object}
     *      status (400, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     * @method complainServiceProvider
     * @for testTraServices
     */

    router.post('/complainServiceProvider', testTRAHandler.complainServiceProvider);
    /**
     * This __method__ create complain about TRA Service
     *
     * __URI:__ ___`/complainTRAService`___
     *
     *  ## METHOD:
     * __POST__
     *
     *  ## Request:
     *     Body:
     *      title:
     *      description:
     *      attachment: //optional img in Base64
     *  ## Responses:
     *      status (200) JSON object: {object}
     *      status (400, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     * @method complainTRAService
     * @for testTraServices
     */

    router.post('/complainTRAService', testTRAHandler.complainTRAService);
    /**
     * This __method__ create Enquiries <br>
     *
     * __URI:__ ___`/complainEnquiries`___
     *
     *  ## METHOD:
     * __POST__
     *
     *  ## Request:
     *     Body:
     *      title:
     *      description:
     *      attachment: //optional img in Base64
     *  ## Responses:
     *      status (200) JSON object: {object}
     *      status (400, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     * @method complainEnquiries
     * @for testTraServices
     */

    router.post('/complainEnquiries', testTRAHandler.complainEnquiries);
    /**
     * This __method__ create Suggestion <br>
     *
     * __URI:__ ___`/sendSuggestion`___
     *
     *  ## METHOD:
     * __POST__
     *
     *  ## Request:
     *     Body:
     *      title:
     *      description:
     *      attachment: //optional img in Base64
     *  ## Responses:
     *      status (200) JSON object: {object}
     *      status (400, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     * @method sendSuggestion
     * @for testTraServices
     */
    router.post('/sendSuggestion', testTRAHandler.sendSuggestion);

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
    router.post('/sendPoorCoverage', testTRAHandler.sendPoorCoverage);

    /**
     * This __method__ create complain about website with forbidden content  <br>
     *
     * __URI:__ ___`/sendHelpSalim`___
     *
     *  ## METHOD:
     * __POST__
     *
     *  ## Request:
     *     Body:
     *       url:
     *       description:
     *  ## Responses:
     *      status (200) JSON object: {object}
     *      status (400, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     * @method sendHelpSalim
     * @for testTraServices
     */
    router.post('/sendHelpSalim', testTRAHandler.sendHelpSalim);
    //router.get('/crm/case', testTRACRMHandler.getCases);

    router.get('/crm/auth', testTRACRMHandler.loginHttp);
    router.get('/crm/auth/callback', testTRACRMHandler.authCallback);
    router.get('/crm/contacts', testTRACRMHandler.getContacts);

    return router;
};