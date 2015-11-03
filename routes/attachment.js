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
     * __URI:__ ___`/attachment`___
     *
     * __METHOD:__ ___`POST`___
     *
     * __Request:__
     *
     *      Body:
     *      attachment // image in Base64
     *
     * __Responses:__
     *
     *      status (201) JSON object: {attachmentId: 'attachmentId'}
     *      status (400, 500) JSON object: {error: 'Text about error'} or {error: object}
     *
     *
     * @method createAttachment
     * @instance
     * @for attachment
     * @memberOf attachment
     */
    router.route('/')
        .post(attachmentHandler.createAttachment);

    /**
     * This __method__ for user upload attachment
     *
     * __URI:__ ___`/attachment/:id`___
     *
     * __METHOD:__ ___`GET`___
     *
     *  __Request:__ ___`/attachment/5638d152872dcb7832b84849`___
     *
     *
     *
     * __Responses:__
     *
     *      status (200) File (Response with Headers 'Content-Type': imageData.type, 'Content-Length': imageData.data.length and ImageData)
     *      status (400, 500) JSON object: {error: 'Text about error'} or {error: object}
     *
     *
     * @method getAttachmentById
     * @instance
     * @for attachment
     * @memberOf attachment
     */

    router.route('/:id')
        .get(attachmentHandler.getAttachmentById)
        .delete(session.isAdminBySession, attachmentHandler.removeAttachment);

    return router;
};