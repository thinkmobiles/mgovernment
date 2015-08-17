var CONST = require('../constants');
var RESPONSE = require('../constants/response');

var Session = function ( db ) {
    'use strict';

    var mongoose = require('mongoose');
    var User = db.model(CONST.MODELS.USER);

    this.register = function ( req, res, userId, userType ) {
        req.session.loggedIn = true;
        req.session.uId = userId;
        req.session.type = userType;
        res.status( 200 ).send( { success: RESPONSE.AUTH.LOG_IN } );
    };

    this.addToken = function ( req, token) {
        //req.session.loggedIn = true;
        //req.session.uId = userId;
        req.session.token = token;
    };

    this.kill = function ( req, res, next ) {

        if(req.session) {
            req.session.destroy();
        }
        res.status(200).send({ success: RESPONSE.AUTH.LOG_OUT });
    };

    this.authenticatedUser = function ( req, res, next ) {

        if( req.session && req.session.uId && req.session.loggedIn ) {
            next();
        } else {
            var err = new Error(RESPONSE.AUTH.UN_AUTHORIZED);
            err.status = 401;
            next(err);
        }

    };

    this.isAdminBySession = function ( req, res, next ) {

        if (!( req.session && req.session.uId && req.session.loggedIn)) {
            var err = new Error(RESPONSE.AUTH.UN_AUTHORIZED);
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


    function getUserTypeById (userId, callback){

        User
            .findOne({_id: userId})
            .exec(function (err, model) {
                if (err) {
                    return callback(err);
                }

                if (model) {

                    return callback(null, model.userType);
                } else {
                    return callback(new Error('No one was found with such _id '));
                }
            });
    }

    this.isAdmin = function ( req, res, next ) {
        var err;


        if (req.session && req.session.type === CONST.USER_TYPE.ADMIN) {
            return next()
        }

        err = new Error(RESPONSE.AUTH.NO_PERMISSIONS);
        err.status = 403;

        next(err);
    };

    this.isAdminApi = function( req, res, next ) {
        res.status( 401).send({error: RESPONSE.AUTH.UN_AUTHORIZED });
    };

    this.isAuthenticatedUser = function ( req, res, next ) {
        if( req.session && req.session.uId && req.session.loggedIn ) {
            res.status( 200 ).send( {success: req.session.uId } );
        } else {
            var err = new Error(RESPONSE.AUTH.UN_AUTHORIZED);
            err.status = 401;
            next(err);
        }
    };

};

module.exports = Session;