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
var TraCrmHandler = require('../handlers/traCrmHandler');

module.exports = function(db) {
    'use strict';

    var users = new UserHandler(db);
    var session = new SessionHandler(db);
    var traCrmHandler = new TraCrmHandler(db);

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
     * @memberOf crmServices
     */
    router.post('/crm/register', traCrmHandler.registerClient);

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
     * @memberOf crmServices
     *
     */
    router.post('/crm/signIn', traCrmHandler.signInClient);

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
     * @memberOf crmServices
     */
    router.post('/crm/signOut', traCrmHandler.signOutClient);

    /**
     * This __method__ for user forgot password for CRM
     *
     * __URI:__ ___`/crm/forgotPass`___
     *
     *  ## METHOD:
     * __POST__
     *
     *  ## Request:
     *      Body:
     *       email
     *
     *  ## Responses:
     *      status (200) JSON object: {object}
     *      status (400, 500) JSON object: {error: 'Text about error'} or  {error: object}
     * @method forgotPass
     * @for crmServices
     * @memberOf crmServices
     */
    router.post('/crm/forgotPass', traCrmHandler.forgotPass);

    /**
     * This __method__ get form to change pass for CRM
     *
     * __URI:__ ___`/crm/changePass`___
     *
     *  ## METHOD:
     * __GET__
     *
     *  ## Request:
     *
     *  ## Responses:
     *      status (200) JSON object: {object}
     *      status (400, 500) JSON object: {error: 'Text about error'} or  {error: object}
     * @method changePassForm
     * @for crmServices
     * @memberOf crmServices
     */
    router.get('/crm/changePass/:token', traCrmHandler.changePassForm);

    /**
     * This __method__ change pass for CRM
     *
     * __URI:__ ___`/crm/changePass`___
     *
     *  ## METHOD:
     * __POST__
     *
     *  ## Request:
     *      Body:
     *       pass,
     *       confirmPass
     *
     *  ## Responses:
     *      status (200) JSON object: {object}
     *      status (400, 500) JSON object: {error: 'Text about error'} or  {error: object}
     * @method changePass
     * @for crmServices
     * @memberOf crmServices
     */
    router.post('/crm/changePass/:token', traCrmHandler.changePass);

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
     *      status (401, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     * @method complainSmsSpam
     * @for crmServices
     * @memberOf crmServices
     */
    router.post('/complainSmsSpam', session.isAuthenticatedUser, traCrmHandler.complainSmsSpam);

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
     *      status (401, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     * @example
     *      {
     *      title: 'It works slowly',
     *      serviceProvider: 'du',
     *      description: 'Amazon is awefull',
     *      referenceNumber: '12312412',
     *      attachment: data:image/png;base64,iVB
     *      }
     *
     * @method complainServiceProvider
     * @for crmServices
     * @memberOf crmServices
     */
    router.post('/complainServiceProvider', session.isAuthenticatedUser, traCrmHandler.complainServiceProvider);

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
     *      status (401, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     * @method complainTRAService
     *
     * @for crmServices
     * @memberOf crmServices
     */
    router.post('/complainTRAService', session.isAuthenticatedUser, traCrmHandler.complainTRAService);

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
     *      status (401, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     * @method complainEnquiries
     * @for crmServices
     * @memberOf crmServices
     */
    router.post('/complainEnquiries', session.isAuthenticatedUser, traCrmHandler.complainInquiries);

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
     *      status (401, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     * @method sendSuggestion
     * @for crmServices
     * @memberOf crmServices
     */
    router.post('/sendSuggestion', session.isAuthenticatedUser, traCrmHandler.sendSuggestion);

    return router;
};