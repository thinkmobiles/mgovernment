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
     * __METHOD:__ ___`GET`___
     *
     *
     * __Responses:__
     *
     *      status (200) JSON Array of object: {[object]}
     *      status (400, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     * @example
     *      [
     *          {
      *             _id: '5638c5c08714a2581508e5ad',
      *             needAuth: false,
      *             icon: null,
      *             serviceName: {
      *                 AR: 'Dynamic تحقق من نطاق',
      *                 EN: 'Dynamic Domain WHOIS'
      *                         }
      *         },
     *          {
     *              _id: '5638c5c08714a2581508e5b0',
     *              needAuth: true,
     *              icon: null,
     *              serviceName: {
     *                AR: 'Dynamic شكوى على الهيئة',
     *                EN: 'Dynamic Complain TRA'
     *                      },
     *          {
     *              _id: '5638c5c08714a2581508e5b6',
     *              needAuth: false,
     *              icon: null,
     *              serviceName: {
     *                  AR: 'Dynamic TEST تحقق من نطاق',
     *                  EN: 'Dynamic TEST WHOIS'
     *                          }
     *          }
     *      ]
     *
     * @method getServices
     * @instance
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
     * __METHOD:__ ___`GET`___
     *
     *
     * __Responses:__
     *
     *      status (200) JSON Array of string: {[string]}
     *      status (400, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     * @example
     *      {
     *          ["complain Poor Coverage", "complain about TRA Service", "complain about Service Provider",
     *          "complain Enquiries", "complain Suggestion", "Rating service", "Help Salim", "SMS Spam Block",
     *          "SMS Spam Report", "Search Device By BrandName", "Search Device By Imei", "Check Domain Availability",
     *          "Get Domain Data"]
     *      }
     *
     * @method getServiceNames
     * @instance
     * @for userServices
     * @memberOf userServices
     */
    router.route('/serviceNames')
        .get(servicesHandler.getServiceNames);

    /**
     * This __method__ get About information for One service
     *
     * __URI:__ ___`/service/about`___
     *
     * __METHOD:__ ___`GET`___
     *
     *      Query:
     *          name //service name
     *          lang// EN or AR
     *
     * __Request:__
     * ___`/service/about?name=Suggestion&lang=EN`___
     *
     *
     * __Responses:__
     *
     *      status (200) JSON object: {}
     *      status (400, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     * @example
     *      {
     *          "Name": "Suggestion",
     *          "About the service": "This service involves submitting a suggestion to TRA",
     *          "Service Package": ".",
     *          "Expected time": "Within 3 working days or more according to the subject of the suggestion",
     *          "Officer in charge of this service": "Call Center Administrator",
     *          "Required documents": "None",
     *          "Service fee": "None",
     *          "Terms and conditions": "Information of the applicant"
     *      }
     *
     * @method getServiceAbout
     * @instance
     * @for userServices
     * @memberOf userServices
     */

    router.route('/about')
        .get(servicesHandler.getServiceAbout);


    ///**
    // * This __method__ create and send request to Service using services Wrappers.
    // *
    // * __URI:__ ___`/service/:serviceId`___
    // *
    // * __METHOD:__ ___`POST`___
    // *
    // *
    // * __Responses:__
    // *      status (200) JSON Array of string: {[string]}
    // *      status (400, 500) JSON object: {error: 'Text about error'} or  {error: object}
    // *
    // * @method sendServiceRequest
    // * @instance
    // * @for userServices
    // * @memberOf userServices
    // */

    ///**
    // * This __method__ get All information about Service, like object with options
    // *
    // * __URI:__ ___`/service/info/:serviceId`___
    // *
    // * __METHOD:__ ___`GET`___
    // *
    // *
    // * __Responses:__
    // *
    // *      status (200) JSON Array of string: {[string]}
    // *      status (403, 500) JSON object: {error: 'Text about error'} or  {error: object}
    // *
    // * @example
    // *
    // *      {
    // *      "_id": "55f7be6a825be2380f278e09",
    // *      "serviceName": "Creating WEB application",
    // *      "buttonTitle": "Send data",
    // *      "profile": {
    // *      "description": "This is service for check URL and create"
    // *      },
    // *      "inputItems": [
    // *      {
    // *      "validateAs": "url",
    // *      "required": true,
    // *      "name": "url",
    // *      "inputType": "string",
    // *      "options": [],
    // *      "dataSource": [],
    // *      "displayName": "Input url",
    // *      "placeHolder": "http://example.xxx/"
    // *      },
    // *      {
    // *      "validateAs": "none",
    // *      "required": true,
    // *      "name": "description",
    // *      "inputType": "text",
    // *      "options": [],
    // *      "dataSource": [],
    // *      "displayName": "Description:",
    // *      "placeHolder": "Enter here"
    // *      },
    // *      {
    // *      "validateAs": "none",
    // *      "required": true,
    // *      "name": "title",
    // *      "inputType": "String",
    // *      "options": [],
    // *      "dataSource": [],
    // *      "displayName": "Title:",
    // *      "placeHolder": "Enter here"
    // *      }
    // *      ],
    // *      "icon": "/icon/55fab29dc019ebe01b211320",
    // *      "serviceDescription": "You can creating WEB application"
    // *      }
    // *
    // * @method getServiceInfo
    // * @instance
    // * @for userServices
    // * @memberOf userServices
    // */

    //TODO delete this when not need. This get service info with EN or AR fields
    //router.route('/info/:serviceId')
    //    .get(servicesHandler.getServiceInfo);

    /**
     * This __method__ get All information about Service, like object with options
     *
     * __URI:__ ___`/service/:serviceId`___
     *
     * __METHOD:__ ___`GET`___
     *
     *
     * __Request:__
     * ___`/service/5638bedc0568cfe809814ed4`___
     *
     *
     * __Responses:__
     *
     *      status (200) JSON Array of string: {[string]}
     *      status (403, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     * @example
     *          {
     *              "_id": "5638bedc0568cfe809814ed4",
     *              "pages": [
     *                  {
     *                      "number": 0,
     *                      "_id": "5638bedc0568cfe809814ed7",
     *                      "inputItems": [
     *                          {
     *                              "order": 0,
     *                              "name": "title",
     *                              "inputType": "string",
     *                              "required": true,
     *                              "validateAs": "string",
     *                              "_id": "5638bedc0568cfe809814ed9",
     *                              "dataSource": [],
     *                              "displayName": {
     *                                  "EN": "title",
     *                                  "AR": "title"
     *                                  },
     *                              "placeHolder": {
     *                                  "EN": "write here",
     *                                  "AR": "AR write here"
     *                                  }
     *                          },
     *                          {
     *                              "order": 1,
     *                              "name": "description",
     *                              "inputType": "text",
     *                              "required": true,
     *                              "validateAs": "string",
     *                              "_id": "5638bedc0568cfe809814ed8",
     *                              "dataSource": [],
     *                              "displayName": {
     *                                  "EN": "message",
     *                                  "AR": "AR message"
     *                                  },
     *                              "placeHolder": {
     *                                  "EN": "your description",
     *                                  "AR": "AR your description"
     *                                  }
     *                         }
     *                                  ]
     *             },
     *             {
     *                  "number": 1,
     *                  "_id": "5638bedc0568cfe809814ed5",
     *                  "inputItems": [
     *                      {
     *                          "order": 0,
     *                          "name": "attachment",
     *                          "inputType": "file",
     *                          "required": false,
     *                          "validateAs": "none",
     *                          "_id": "5638bedc0568cfe809814ed6",
     *                          "dataSource": [],
     *                          "displayName": {
     *                              "EN": "attachment",
     *                              "AR": "AR attachment"
     *                              },
     *                          "placeHolder": {
     *                              "EN": "some image",
     *                              "AR": "AR some image"
     *                              }
     *                      }
     *                              ]
     *           }
     *              ],
     *         "buttonTitle": {
     *              "AR": "شكوى على الهيئة",
     *              "EN": "Send Complain"
     *                      },
     *         "needAuth": true,
     *         "icon": null,  // or uri like: icon/56sdbrtrd0568cfe8098trt545d4 !!! WARNING: for download Icon use: uri + /iconType (one of: @2x|@3x|xxxhdpi|xxhdpi|xhdpi|hdpi|mdpi)
     *                        //Example: http://projects.thinkmobiles.com:7791/icon/56sdbrtrd0568cfe8098trt545d4/@3x
     *         "serviceName": {
     *              "AR": "Dynamic شكوى على الهيئة",
     *              "EN": "Dynamic Complain TRA"
     *                      }
     *          }
     *
     * @method getServiceOptions
     * @instance
     * @for userServices
     * @memberOf userServices
     */

    router.route('/:serviceId')
        .get(servicesHandler.getServiceOptions)
        .post(accessHandler.isAccessAvailable, servicesHandler.sendServiceRequest);

    return router;
};