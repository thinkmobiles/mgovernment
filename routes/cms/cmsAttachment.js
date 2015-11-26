var express = require('express');
var router = express.Router();

var AttachmentHandler = require('../../handlers/attachment');

module.exports = function(db) {
    'use strict';

    var attachmentHandler = new AttachmentHandler(db);

    router.route('/:id')
        .delete(attachmentHandler.removeAttachment);

    return router;
};