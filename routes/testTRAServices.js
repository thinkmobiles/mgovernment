/**
 * Provides the REST API for services that get information about url or IMEI
 *
 * @class testTraServices
 *
 */

var express = require('express');
var router = express.Router();

var TestTRAHandler = require('../handlers/testTRAHandler');

module.exports = function(db) {
    'use strict';

    var testTRAHandler = new TestTRAHandler(db);

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
     *      status (401, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     * @method complainSmsBlock
     * @for testTraServices
     * @memberOf testTraServices
     */

    router.post('/complainSmsBlock', testTRAHandler.complainSmsBlock);

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
     *      status (400, 401, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     * @method sendPoorCoverage
     * @for testTraServices
     * @memberOf testTraServices
     */
    router.post('/sendPoorCoverage', testTRAHandler.sendPoorCoverage);

    /**
     * This __method__ create complain about TRA Service
     *
     * __URI:__ ___`/sendHelpSalim`___
     *
     *  ## METHOD:
     * __POST__
     *
     *  ## Request:
     *     Body:
     *      url:
     *      description:
     *
     *  ## Responses:
     *      status (200) JSON object: {object}
     *      status (401, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     * @method sendHelpSalim
     * @for testTraServices
     * @memberOf testTraServices
     */

    router.post('/sendHelpSalim', testTRAHandler.sendHelpSalim);

    return router;
};