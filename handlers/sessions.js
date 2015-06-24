var CONST = require('../constants');
var RESPONSE = require('../constants/response');
var ProfileHandler = require('./profiles');

var Session = function ( db ) {


    this.register = function ( req, res, userId, userType ) {
        req.session.loggedIn = true;
        req.session.uId = userId;
        req.session.type = userType;
        res.status( 200 ).send( { success: RESPONSE.AUTH.LOG_IN } );
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
        res.status( 401).send({err: RESPONSE.AUTH.UN_AUTHORIZED });
    };

    this.isAuthenticatedUser = function ( req, res, next ) {
        if( req.session && req.session.uId && req.session.loggedIn ) {
            res.status( 200 ).send( {success: "Is authenticated", uId: req.session.uId } );
        } else {
            var err = new Error(RESPONSE.AUTH.UN_AUTHORIZED);
            err.status = 401;
            next(err);
        }
    };

};

module.exports = Session;