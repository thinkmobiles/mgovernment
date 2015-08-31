/**
 * This method used for sending to UI Attachment (*.img in Base64) that users add to theirs complains
 * @type {*|exports|module.exports}
 */

var CONST = require('../constants');
var RESPONSE = require('../constants/response');

var Attachment = function(db) {
    'use strict';

    var mongoose = require('mongoose');
    var ObjectId = mongoose.Types.ObjectId;
    var Attachments = db.model(CONST.MODELS.ATTACHMENT);

    this.getAttachmentById = function (req, res, next) {
        var attachmentId = req.params.attachmentId;

        if (!ObjectId.isValid(attachmentId)) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        Attachments
            .findById(attachmentId)
            .exec(function (err, model) {
                var srcBase64;

                if (err) {
                    return next(err);
                }
                if (!model) {
                    return res.status(404).send({error: 'Not Found Attachment'})
                }
                srcBase64 = model.toJSON().attachment;
                res.status(200).send(' <img src ="' + srcBase64 +'">');
            });
    };
};

module.exports = Attachment;
