var CONST = require('../constants');
var RESPONSE = require('../constants/response');
var mongoose = require('mongoose');

var AccessHandler = function (db) {
    'use strict';

    var User = db.model(CONST.MODELS.USER);
    var Service = db.model(CONST.MODELS.SERVICE);

    this.isAccessAvailable = function (req, res, next) {

        var checkOptions = {
            userId: req.session ? req.session.uId : null,
            serviceId: req.params.serviceId
        };

        getAccessAvailability(checkOptions, function (err, available) {
            if (err) {
                return next(err);
            }
            if (!available) {
                err = new Error(RESPONSE.AUTH.NO_PERMISSIONS);
                err.status = 403;
                return next(err);
            }
            return  next();
        });
    };

    function getAccessAvailability(options, callback) {

        getUserTypeById(options.userId, function (err, userType) {
            if (err) {
                return callback(err);
            }
            getServiceForTypes(options.serviceId, function (err, availableTypes) {
                if (err) {
                    return callback(err);
                }
                var inAvailableTypes = availableTypes.indexOf(userType) > -1;
                return callback(null, inAvailableTypes);
            })
        });
    }

    function getUserTypeById(userId, callback) {

        if (!userId) {
            return callback(null, CONST.USER_TYPE.GUEST);
        }

        User
            .findOne({_id: userId})
            .select('userType')
            .exec(function (err, model) {
                if (err) {
                    return callback(err);
                }

                if (!model) {
                    return callback(null, CONST.USER_TYPE.GUEST);
                }

                callback(null, model.userType);
            });
    }

    function getServiceForTypes(serviceId, callback) {

        Service
            .findOne({_id: serviceId})
            .select('forUserType')
            .exec(function (err, model) {
                if (err) {
                    return callback(err);
                }

                if (!model) {
                    var error = new Error('Not found such service');
                    error.status = 404;
                    return callback(error);
                }

                callback(null, model.forUserType);
            });
    }

};

module.exports = AccessHandler;