var CONST = require('../constants');
var RESPONSE = require('../constants/response');

var Session = function (db) {
    'use strict';

    var mongoose = require('mongoose');
    var User = db.model(CONST.MODELS.USER);

    this.register = function (req, res, userId, userType, crmId) {
        req.session.loggedIn = true;
        req.session.uId = userId;
        req.session.type = userType;

        if (crmId) {
            req.session.crmId = crmId;
        }
        res.status(200).send({success: RESPONSE.AUTH.LOG_IN});
    };

    this.addToken = function (req, token) {
        req.session.token = token;
    };

    this.kill = function (req, res, next) {

        if (req.session) {
            req.session.destroy();
        }

        res.status(200).send({success: RESPONSE.AUTH.LOG_OUT});
    };

    this.isAuthenticatedUser = function (req, res, next) {

        if (req.session && req.session.uId && req.session.loggedIn) {
            next();
        } else {
            var err = new Error(RESPONSE.AUTH.UN_AUTHORIZED);

            err.status = 401;
            next(err);
        }
    };

    this.isAdminBySession = function (req, res, next) {
        var err;

        if (!( req.session && req.session.uId && req.session.loggedIn)) {
            err = new Error(RESPONSE.AUTH.UN_AUTHORIZED);
            err.status = 401;

            return next(err);
        }

        var userId = req.session.uId;

        getUserTypeById(userId, function (err, userType) {

            if (userType === CONST.USER_TYPE.ADMIN) {
                return next();
            }
            err = new Error(RESPONSE.AUTH.NO_PERMISSIONS);
            err.status = 403;

            return next(err);
        });
    };

    function getUserTypeById(userId, callback) {

        User
            .findOne({'_id': userId})
            .exec(function (err, model) {
                if (err) {
                    return callback(err);
                }
                if (model) {
                    return callback(null, model.userType);
                } else {
                    return callback(new Error(RESPONSE.ON_ACTION.NOT_FOUND));
                }
            });
    }
};

module.exports = Session;