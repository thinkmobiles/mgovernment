'use strict';

/**
 * Provides the REST API for __CRM Services__
 *
 * @class crmServices
 *
 */
var express = require('express');
var router = express.Router();
var UserHandler = require('../handlers/users');
var SessionHandler = require('../handlers/sessions');
var CrmNetWrapperHandler = require('../handlers/crmNetWrapper/testCrmNetWrapper');

module.exports = function(db) {

    var users = new UserHandler(db);
    var session = new SessionHandler(db);
    var crmNetWrapperHandler = new CrmNetWrapperHandler(db);

    /**
     * This __method__ for user  register in CRM
     *
     * __URI:__ ___`/crm/register`___
     *
     *  ## METHOD:
     * __POST__
     *
     *  ## Request:
     *      Body:
     *      login,
     *      pass,
     *      first,
     *      last,
     *      emiratesId,
     *      address,
     *      state,
     *      landline,
     *      mobile,
     *      email
     *
     *  ## Responses:
     *      status (200) JSON object: {object}
     *      status (400, 500) JSON object: {error: 'Text about error'} or  {error: object}
     * @example
     *      {
     *      login: 'digiTest2',
     *      pass: 'password777',
     *      first: 'Test',
     *      last: 'Digi',
     *      emiratesId: '784-1990-NNNNNNN-C',
     *      address: 'some street, 23/5',
     *      state: 3,
     *      landline: '+987654321',
     *      mobile: '+987654321',
     *      email: 'darkvas90@gmail.com'
     *      }
     *
     * @method register
     * @for crmServices
     */

    router.post('/crm/register', crmNetWrapperHandler.registerClient);
    /**
     * This __method__  for user signIn in CRM
     *
     * __URI:__ ___`/crm/signIn`___
     *
     *  ## METHOD:
     * __POST__
     *
     *  ## Request:
     *     Body:
     *      login
     *      pass
     *
     *  ## Responses:
     *      status (200) JSON object: {object}
     *      status (400, 500) JSON object: {error: 'Text about error'} or  {error: object}
     * @example
     *      {
     *      login: 'testUser',
     *      pass: 'password777'
     *      }
     * @method signIn
     * @for crmServices
     *
     */

    router.post('/crm/signIn', crmNetWrapperHandler.signInClient);

    /**
     * This __method__ for user signOut from CRM
     *
     * __URI:__ ___`/crm/signOut`___
     *
     *  ## METHOD:
     * __POST__
     *
     *  ## Request:
     *
     *  ## Responses:
     *      status (200) JSON object: {object}
     *      status (400, 500) JSON object: {error: 'Text about error'} or  {error: object}
     * @method signOut
     * @for crmServices
     *
     */

    router.post('/crm/signOut', crmNetWrapperHandler.signOutClient);

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
     * @for crmServices
     */
    router.post('/complainSmsSpam', session.authenticatedUser, crmNetWrapperHandler.complainSmsSpam);
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
     * @for crmServices
     */
    router.post('/complainServiceProvider', session.authenticatedUser, crmNetWrapperHandler.complainServiceProvider);
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
     * @for crmServices
     */

    router.post('/complainTRAService', session.authenticatedUser, crmNetWrapperHandler.complainTRAService);
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
     * @for crmServices
     */

    router.post('/complainEnquiries', session.authenticatedUser, crmNetWrapperHandler.complainInquiries);
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
     * @for crmServices
     */
    router.post('/sendSuggestion', session.authenticatedUser, crmNetWrapperHandler.sendSuggestion);

    return router;
};