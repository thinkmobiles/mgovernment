var CONST = require('../constants');
var RESPONSE = require('../constants/response');

var Image = function(db) {
    'use strict';

    var mongoose = require('mongoose');
    var Grid = require('gridfs-stream');
    var gridFs = Grid(db.db, mongoose.mongo);

    var ObjectId = mongoose.Types.ObjectId;

    var Image = db.model(CONST.MODELS.IMAGE);
    var self = this;

    this.uploadImageReq = function (req, res, next) {

        var options = req.body;

        if (!options.imageBase64) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        var imageOptions = {
            imageBase64: options.imageBase64
        };

        self.uploadImageBase64(imageOptions, function (err, imageModel) {
            if (err) {
                return next(err);
            }
            res.status(200).send({imageId: imageModel.id});
        });
    };

    this.uploadImageBase64 = function (options, callback) {

        if (!options.imageBase64) {
            return callback({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        encodeFromBase64(options.imageBase64, function (err, encodedImageData) {
            if (err) {
                return callback(err);
            }

            /*var fileId = new ObjectID();
            var gridStore = new GridStore(db, fileId, 'w');

           /* gridFs.create(encodedImageData.data, function(err, fileInfo) {
                if (err) {
                    return callback(err);
                }

                return callback(null, fileInfo);
            });*/

            var image = new Image();

            image.data = encodedImageData.data;
            image.contentType = encodedImageData.type;

            image
                .save(function (err, model) {
                if (err) {
                    return callback(err);
                }

                return callback(null, model);
            });
        });
    };

    function encodeFromBase64(dataString, callback) {
        if (!dataString) {
            callback({error: 'Invalid input string'});
            return;
        }

        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        var imageData = {};

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

            var imageTypeRegularExpression = /\/(.*?)$/;
            var imageTypeDetected = imageData
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

    this.getImage = function (req, res, next) {

        var imageId = req.params.id;

        if (!ObjectId.isValid(imageId)) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        Image
            .findById(imageId)
            .exec(function (err, model) {
                if (err) {
                    return next(err);
                }
                if (!model) {
                    return res.status(404).send({error: 'Not Found Image'})
                }

                res.contentType(model.contentType);
                res.status(200).send(model.data);
            });
    };

    this.getImageUrl = function (imageId, callback) {
        var imageUrl = process.env.HOST + 'image/' + imageId;
        return callback(null, imageUrl);
    };

    this.removeImage = function (req, res, next) {

        var imageId = req.params.id;

        if (!ObjectId.isValid(imageId)) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        Image
            .findByIdAndRemove(imageId)
            .exec(function (err, model) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({imageId: imageId});
            });
    };
};

module.exports = Image;
