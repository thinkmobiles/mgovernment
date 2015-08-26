/**
 * Provides the operation with services for __admin__ acount
 *
 * @class adminServices
 *
 */

/**
 * This __method__ create service and save to DB <br>
 *
 * __URI:__ ___`/adminServices`___
 *
 *  ## METHOD:
 * __POST__
 *
 *  ## Request:
 *     JSON object {ServiceModel}
 *
 *  ## Responses:
 *      status (200) JSON object: {ServiceModel}
 *      status (400, 403, 500) JSON object: {error: 'Text about error'} or  {error: object}
 *
 *
 * @example
 *     {
 *       serviceProvider: 'TmaTraServices',
 *       serviceName: 'Get Domain Data',
 *       serviceType: 'get info',
 *       baseUrl: 'http://134.249.164.53:7791/',
 *       profile: {
 *           description : 'Get Domain Data'},
 *
 *       forUserType: [CONST.USER_TYPE.GUEST, CONST.USER_TYPE.CLIENT, CONST.USER_TYPE.ADMIN, CONST.USER_TYPE.COMPANY, CONST.USER_TYPE.GOVERNMENT],
 *       inputItems: [
 *          {
 *             order: 1,
 *            name: 'checkUrl',
 *               inputType: 'string'
 *           }
 *
 *        ],
 *        method: 'GET',
 *        url: 'checkWhois',
 *        params: {
 *            needUserAuth: false,
 *            query: ['checkUrl']
 *        }
 *      }
 * @method createService
 * @for adminServices
 */



var express = require( 'express' );
var ServicesHandler = require('../handlers/adminServices');

module.exports = function(db){
    'use strict';

    var router = express.Router();
    var servicesHandler = new ServicesHandler(db);

    /**
     * This __method__ get all services from DB
     *
     * __URI:__ ___`/adminServices`___  <br>
     *
     * ## METHOD:
     * __GET__
     *
     *  ## Responses:
     *      status (200) Array of JSON objects: {[ServiceModel]}
     *      status (400, 403, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     *
     * @method getServices
     * @for adminServices
     */

    router.route('/')
        .post(servicesHandler.createService)
        .get(servicesHandler.getServices);

    router.route('/getCount/')
        .get(servicesHandler.getCount);

    router.route('/:id')
        .put(servicesHandler.updateServiceById)
        .get(servicesHandler.getServiceById)
        .delete(servicesHandler.deleteServiceById);

    return router;
};
