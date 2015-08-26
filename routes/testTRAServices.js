/**
 * Provides the operation with services for __admin__ account
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
     *      status (400, 403, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     * @method sendPoorCoverage
     * @for testTraServices
     */
    router.post('/sendPoorCoverage', testTRAHandler.sendPoorCoverage);

    router.post('/sendHelpSalim', testTRAHandler.sendHelpSalim);

    return router;
};