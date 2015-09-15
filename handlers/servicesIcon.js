/**
 * This method used for sending to UI Attachment (*.img in Base64) that users add to theirs complains
 * @type {*|exports|module.exports}
 */

var CONST = require('../constants');
var RESPONSE = require('../constants/response');

var ServiceIcon = function(db) {
    'use strict';

    var mongoose = require('mongoose');
    var ObjectId = mongoose.Types.ObjectId;
    var ServiceIcons = db.model(CONST.MODELS.SERVICES_ICON);
    var User = db.model(CONST.MODELS.USER);

    this.getServicesIconByIdAndType = function (req, res, next) {
        var id = req.params.id;
        var name = req.params.type;
        console.log('name: ', name,' id: ',id);

        if (!(/(^)(@2x|@3x|xxhdpi|xhdpi|hdpi|mdpi)($)/).test(name)) {
            return res.status(404).send({error: 'Bad icon name'})
        }
        ServiceIcons
            .findById(id, name )
            .exec(function (err, model) {
                var srcBase64;

                if (err) {
                    return next(err);
                }
                if (!model) {
                    return res.status(404).send({error: 'Not Found Icons'})
                }
                srcBase64 = model.toJSON()[name];
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

    this.getServicesIconByServiceIdAndType = function (req, res, next) {
        var serviceId = req.params.id;
        var name = req.params.type;
        console.log('name: ', name,' serviceId: ',serviceId);

        if (!(/(^)(@2x|@3x|xxhdpi|xhdpi|hdpi|mdpi)($)/).test(name)) {
            return res.status(404).send({error: 'Bad icon name'})
        }

        var searchQuery = {
            serviceId: serviceId
        };

        ServiceIcons
            .findOne(searchQuery, name )
            //.select [name]
            .exec(function (err, model) {
                var srcBase64;

                if (err) {
                    return next(err);
                }
                if (!model) {
                    return res.status(404).send({error: 'Not Found Icons'})
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

    this.getServicesIconById = function (req, res, next) {
        var id = req.params.id;

        ServiceIcons
            .findById(id)
            .exec(function (err, model) {
                if (err) {
                    return res.status(500).send({error: err})
                }
                if (!model) {
                    return res.status(400).send({error: 'Not Found Attachment'})
                }
                return res.status(200).send(model);
            })
    };

    this.getServicesIcons = function (req, res, next) {
        var name = req.query.type;
        console.log('type : ', name);

        ServiceIcons
            .find({}, name )
            //.select [name]
            .exec(function (err, models) {
                if (err) {
                    return res.status(500).send({error: err})
                }
                if (!models) {
                    return res.status(404).send({error: 'Not Found Attachment'})
                }

                return res.status(200).send(models);
            })
    };

    this.createServicesIcon = function (req, res, next) {

        var icons = req.body;
        var servicesIcon = new ServiceIcons(icons);
        servicesIcon
            .save(function (err, model) {
                if (err) {
                    return res.status(500).send({error: err})
                }
                return res.status(200).send({success: RESPONSE.ON_ACTION.SUCCESS});
            });
    };

    this.updateServicesIconServicesID = function (req, res, next) {
        return res.status(500).send({error: 'Not Implemented'});

        var icons = req.body.icons;
        var servicesIcon = new ServiceIcons(icons);
        servicesIcon
            .save()
            .exec(function (err, model) {
                if (err) {
                    return res.status(500).send({error: err})
                }
                return res.status(200).send({success: RESPONSE.ON_ACTION.SUCCESS});
            });
    };

    this.deleteServicesIcon = function (req, res, next) {
        return res.status(500).send({error: 'Not Implemented'})
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

module.exports = ServiceIcon;
