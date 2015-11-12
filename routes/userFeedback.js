/**
 * Provides ability for user create Feedback
 *
 * @class userFeedback
 *
 */

var express = require('express');
var router = express.Router();

var UserFeedback = require('../handlers/userFeedback');
var SessionHandler = require('../handlers/sessions');

module.exports = function(db) {
    'use strict';

    var userFeedback = new UserFeedback(db);
    var session = new SessionHandler(db);

    /**
     * This __method__ for user create feedback
     *
     * __URI:__ ___`/feedback`___
     *
     *  ## METHOD:
     * __POST__
     *
     *  ## Request:
     *      Body:
     *      serviceName,
     *      rate,
     *      feedback
     *
     *  ## Responses:
     *      status (201) JSON object: {object}
     *      status (400, 500) JSON object: {error: 'Text about error'} or  {error: object}
     * @example
     *      {
     *      serviceName: 'searchMobile',
     *      rate: 3,
     *      feedback: 'Nice service',
     *      }
     *
     *
     * @method createFeedback
     * @for userFeedback
     * @memberOf userFeedback
     */
    router.route('/')
        .post(userFeedback.createFeedback)
        .get(session.isAdminBySession, userFeedback.getAllFeedback);

    router.route('/:id')
        .delete(session.isAdminBySession, userFeedback.deleteFeedback);

    router.route('/getCount/')
        .get(session.isAdminBySession, userFeedback.getCount);

    return router;
};