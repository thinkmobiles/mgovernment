var CONST = require('../constants');
var RESPONSE = require('../constants/response');
var mongoose = require('mongoose');

var AccessHandler = function (db) {
    var User = db.model(CONST.MODELS.USER);
    var Service = db.model(CONST.MODELS.SERVICE);

    this.isAccessAvailable = function (req, res, next) {

        var checkOptions = {
            userId: req.session.uId,
            serviceOptions: {
                serviceProvider: req.params.provider,
                serviceName: req.params.name
            }
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
            next();
        });
    };

    function getAccessAvailability(options, callback) {
        var userId = options.userId;
        var serviceOptions = options.serviceOptions;

        getUserTypeById(userId, function (err, userType) {
            if (err) {
                return callback(err);
            }
            getServiceForTypes(serviceOptions, function (err, availableTypes) {
                if (err) {
                    return callback(err);
                }
                var inAvailableTypes = availableTypes.indexOf(userType) > -1 || availableTypes.indexOf('All');
                callback(null, inAvailableTypes);
            })
        });
    }

    function getUserTypeById(userId, callback) {

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

    function getServiceForTypes(queryOpt, callback) {

        Service
            .findOne(queryOpt)
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