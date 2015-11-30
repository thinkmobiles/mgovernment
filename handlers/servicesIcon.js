/**
 * This method used for sending to UI Attachment (*.img in Base64) that users add to theirs complains
 * @type {*|exports|module.exports}
 */

var CONST = require('../constants');
var RESPONSE = require('../constants/response');
var HistoryHandler = require('./adminHistoryLog');

var ServiceIcon = function(db) {
    'use strict';

    var mongoose = require('mongoose');
    var ObjectId = mongoose.Types.ObjectId;
    var ServiceIcons = db.model(CONST.MODELS.SERVICES_ICON);
    var User = db.model(CONST.MODELS.USER);
    var adminHistoryHandler = new HistoryHandler(db);

    this.getServicesIconByIdAndType = function (req, res, next) {
        var id = req.params.id;
        var name = req.params.type;
        console.log('name: ', name, ' id: ', id);

        if (!id || !name || !ObjectId.isValid(id)) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        if (!(/(^)(@2x|@3x|xxxhdpi|xxhdpi|xhdpi|hdpi|mdpi)($)/).test(name)) {
            return res.status(404).send({error: 'Bad icon name'})
        }

        ServiceIcons
            .findById(id, name)
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

                encodeFromBase64(srcBase64, function (err, imageData) {
                    if (err) {
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

    this.getServicesIconBase64ByIdAndType = function (req, res, next) {
        var id = req.params.id;
        var name = req.params.type;

        if (!(/(^)(@2x|@3x|xxxhdpi|xxhdpi|xhdpi|hdpi|mdpi)($)/).test(name)) {
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
                res.status(200).send(srcBase64);
            });
    };

    this.getServicesIconByServiceIdAndType = function (req, res, next) {
        var serviceId = req.params.id;
        var name = req.params.type;

        if (!(/(^)(@2x|@3x|xxhdpi|xhdpi|hdpi|mdpi)($)/).test(name)) {
            return res.status(404).send({error: 'Bad icon name'})
        }

        var searchQuery = {
            serviceId: serviceId
        };

        ServiceIcons
            .findOne(searchQuery, name )
            .exec(function (err, model) {
                var srcBase64;

                if (err) {
                    return next(err);
                }
                if (!model) {
                    return res.status(404).send({error: 'Not Found Icons'})
                }
                srcBase64 = model.toJSON().attachment;
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

    this.getCount = function (req, res, next) {

        ServiceIcons
            .count({}, function (err, count) {
                if (err) {
                    return next(err);
                }
                return res.status(200).send({count: count});
            });
    };

    this.getServicesIcons = function (req, res, next) {
        var sortField = req.query.orderBy || 'createdAt';
        var sortDirection = +req.query.order || -1;
        var skipCount = ((req.query.page - 1) * req.query.count) || 0;
        var limitCount = req.query.count || 20;
        var name = req.query.type;
        var searchTerm = req.query.searchTerm;
        var sortOrder = {};
        var searchQuery = {};

        sortOrder[sortField] = sortDirection;

        if (searchTerm) {
            searchQuery = {
                $and: [{'title': {$regex: searchTerm, $options: 'i'}}]
            };
        }

        ServiceIcons
            .find(searchQuery, name + ' title' )
            .sort(sortOrder)
            .skip(skipCount)
            .limit(limitCount)
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

    this.updateServicesIconById = function (req, res, next) {

        var icon = req.body;

        if (!icon) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        icon.updateAt = new Date();
        console.dir(icon);

        ServiceIcons
            .findOneAndUpdate({'_id': icon._id},icon)
            .exec(function (err, model) {
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

        var searchQuery = {
            '_id': req.params.id
        };

        if (!searchQuery._id) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        ServiceIcons
            .findOne(searchQuery)
            .remove()
            .exec(function (err, model) {
                if (err) {
                    return next(err);
                }

                var log = {
                    user: req.session.uId,
                    action: CONST.ACTION.DELETE,
                    model: CONST.MODELS.SERVICES_ICON,
                    modelId: req.params.id,
                    description: 'Delete Service'
                };
                adminHistoryHandler.pushlog(log);

                return res.status(200).send({success: RESPONSE.ON_ACTION.SUCCESS});
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

module.exports = ServiceIcon;
