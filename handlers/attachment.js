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
    var User = db.model(CONST.MODELS.USER);

    this.getAttachmentById = function (req, res, next) {
        var attachmentId = req.params.imageId;

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
                //res.status(200).send(' <img src ="' + srcBase64 +'">');

                encodeFromBase64(srcBase64, function (err,imageData){
                    if (err){
                        console.log('Error when encode image', err);
                    }

                    res.writeHead(200, {
                        'Content-Type': imageData.type,
                        'Content-Length': imageData.data.length
                    });
                    res.end(imageData.data);
                })
            });
    };

    this.getAttachmentBySession = function (req, res, next) {
        var userId = req.session.uId;

        User
            .findById(userId)
            .select('profile.avatar')
            .populate('profile.avatar')
            .exec(function (err, model) {
                var srcBase64;

                if (err) {
                    return next(err);
                }
                if (!model) {
                    return res.status(404).send({error: 'Not Found Attachment'})
                }
                srcBase64 = model.toJSON().profile.avatar.attachment;

                encodeFromBase64(srcBase64, function (err,imageData){
                    if (err){
                        console.log('Error when encode image', err);
                    }

                    res.writeHead(200, {
                        'Content-Type': imageData.type,
                        'Content-Length': imageData.data.length
                    });
                    res.end(imageData.data);
                })
            });
    };

    function encodeFromBase64(dataString, callback) {
        var imageData = {};
        var imageTypeRegularExpression;
        var imageTypeDetected;
        var matches;

        if (!dataString) {
            callback({error: 'Invalid input string'});
            return;
        }
        matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

        if (!matches || matches.length !== 3) {
            try {
                imageData.type = 'image/png';
                imageData.data = new Buffer(dataString, 'base64');
                imageData.extention = 'png';
            } catch (err) {
                callback({error: 'Invalid input string'});
                return;
            }
        } else {
            imageData.type = matches[1];
            imageData.data = new Buffer(matches[2], 'base64');
            imageTypeRegularExpression = /\/(.*?)$/;
            imageTypeDetected = imageData
                .type
                .match(imageTypeRegularExpression);

            if (imageTypeDetected[1] === "svg+xml") {
                imageData.extention = "svg";
            } else {
                imageData.extention = imageTypeDetected[1];
            }
        }
        callback(null, imageData);
    }
};

module.exports = Attachment;
