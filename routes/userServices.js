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
     * @example
     *      [
     *      {"_id": "55f121f2ef19aa340ca030e2",
     *      "serviceName": "TestField",
     *      "icon": "/icon/undefined"
     *      },
     *      {
     *      "_id": "55e80bc12ab6f29409add962",
     *      "serviceName": "Network Monitor",
     *      "icon": "/icon/undefined"
     *      },
     *      {
     *      "_id": "55f6c775b03ca17011e2b989",
     *      "serviceName": "complain Hotel",
     *      "icon": "/icon/55fa5ca83bd717ac1ae2ce74"
     *      }, .....
     *      ]
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

    router.route('/about')
        .get(servicesHandler.getServiceAbout);


    /**
     * This __method__ create and send request to Service using services Wrappers.
     *
     * __URI:__ ___`/service/:serviceId`___
     *
     *  ## METHOD:
     * __POST__
     *
     *
     *  ## Responses:
     *      status (200) JSON Array of string: {[string]}
     *      status (400, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     * @method sendServiceRequest
     * @for userServices
     * @memberOf userServices
     */
    /**
     * This __method__ get All information about Service, like object with options
     *
     * __URI:__ ___`/service/info/:serviceId`___
     *
     *  ## METHOD:
     * __GET__
     *
     *
     *  ## Responses:
     *      status (200) JSON Array of string: {[string]}
     *      status (403, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     * @example
     *
     *      {
     *      "_id": "55f7be6a825be2380f278e09",
     *      "serviceName": "Creating WEB application",
     *      "buttonTitle": "Send data",
     *      "profile": {
     *      "description": "This is service for check URL and create"
     *      },
     *      "inputItems": [
     *      {
     *      "validateAs": "url",
     *      "required": true,
     *      "name": "url",
     *      "inputType": "string",
     *      "options": [],
     *      "dataSource": [],
     *      "displayName": "Input url",
     *      "placeHolder": "http://example.xxx/"
     *      },
     *      {
     *      "validateAs": "none",
     *      "required": true,
     *      "name": "description",
     *      "inputType": "text",
     *      "options": [],
     *      "dataSource": [],
     *      "displayName": "Description:",
     *      "placeHolder": "Enter here"
     *      },
     *      {
     *      "validateAs": "none",
     *      "required": true,
     *      "name": "title",
     *      "inputType": "String",
     *      "options": [],
     *      "dataSource": [],
     *      "displayName": "Title:",
     *      "placeHolder": "Enter here"
     *      }
     *      ],
     *      "icon": "/icon/55fab29dc019ebe01b211320",
     *      "serviceDescription": "You can creating WEB application"
     *      }
     *
     * @method getServiceInfo
     * @for userServices
     * @memberOf userServices
     */


    router.route('/info/:serviceId')
        .get(servicesHandler.getServiceInfo);

    /**
     * This __method__ get All information about Service, like object with options
     *
     * __URI:__ ___`/service/short/:serviceId`___
     *
     *  ## METHOD:
     * __GET__
     *
     *
     *  ## Responses:
     *      status (200) JSON Array of string: {[string]}
     *      status (403, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     * @example
     *          {
     *          serviceProvider: 'Capalaba',
     *          serviceName: 'Riteils',
     *          serviceType: 'XZ WTF ?',
     *          baseUrl: 'http://134.249.164.53:7788/',
     *          profile: {
     *              description : 'bla bla bla'},
     *              forUserType: ['client', 'company'],
     *              inputItems: [{
     *                  order: 11,
     *                  name: 'eeee',
     *                  inputType: 'IMG',
     *                  placeHolder: 'base64 sdasd sfdsd fkjjbkzbhkzashe2kj421u34hejrb lkj32  ',
     *                  options: []
     *                  }],
     *          method: 'GET',
     *          url: 'retailer?count=10&page=1&orderBy=name&order=ASC',
     *          params: {
     *          needUserAuth: true,
     *          onClick: '/sdadsadsa sadasdas'
     *            }
     *          }
     *
     * @method getServiceOptions
     * @for userServices
     * @memberOf userServices
     */

    router.route('/:serviceId')
        .get(servicesHandler.getServiceOptions)
        .post(accessHandler.isAccessAvailable, servicesHandler.sendServiceRequest);

    return router;
};