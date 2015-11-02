/**
 * Provides ability for user to upload and get Attachment
 *
 * @class attachment
 *
 */

var express = require('express');
var router = express.Router();

var AttachmentHandler = require('../handlers/attachment');
var SessionHandler = require('../handlers/sessions');

module.exports = function(db) {
    'use strict';

    var attachmentHandler = new AttachmentHandler(db);
    var session = new SessionHandler(db);

    /**
     * This __method__ for user upload attachment
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
     *      status (201) JSON object: {id: 'attachmentId'}
     *      status (400, 500) JSON object: {error: 'Text about error'} or {error: object}
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
        .post(attachmentHandler.createAttachment);

    router.route('/:id')
        .get(attachmentHandler.getAttachmentById)
        .delete(session.isAdminBySession, attachmentHandler.removeAttachment);

    return router;
};