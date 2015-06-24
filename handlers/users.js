var SessionHandler = require('./sessions');
var CONST = require('../constants');
var RESPONSE = require('../constants/response');

var User = function(db) {

    var mongoose = require('mongoose');
    var session = new SessionHandler(db);

    var lodash = require('lodash');
    var async = require('async');
    var User = db.model('user');
    var Profile = db.model('profile');



    function userTypeValidate(userType) {
        var validate = false;
        for (var k in CONST.USER_TYPE) {
            if  (CONST.USER_TYPE[k] === userType) {
                validate = true;
            }
        }
        console.log('userType validate:',validate);
        return validate;
    }

    function isValidDeviceOs(deviceOs){
        var validate = false;
        for (var k in CONST. DEVICE_TYPE) {
            if  (CONST. DEVICE_TYPE[k] === deviceOs) {
                validate = true;
            }
        }
        console.log('DeviceOS validate:',validate);
        return validate;
    }

    this.isAdminBySession = function ( req, res, next ) {

        var userId = req.session.uId;

        getUserById(userId, function (err, profile) {
            console.dir(profile);
            if (profile.userType === CONST.USER_TYPE.ADMIN) {
                console.log(' Admine acces -> Next');
                return next();
            }

            err = new Error(RESPONSE.AUTH.NO_PERMISSIONS);
            err.status = 403;
            return next(err);

        });
    };

    function getUserById (userId, callback){
        console.log('Profiles Handlers started');

        User
            .findOne({_id: userId})
            .exec(function (err, model) {
                if (err) {
                    return callback(err);
                }

                console.log('User find by id', userId);

                if (model) {
                    console.log('find succesful ');
                    //    console.log( model);

                    return callback(null, model.toJSON());
                } else {
                    console.log('No one was found');
                    return callback(new Error('No one was found with such _id '));
                }
            });
    }

    this.signInClient = function (req, res, next) {
        var body = req.body;
        var login = body.login;
        var pass = body.pass;
        var err;
        var device = {
            deviceOs: body.deviceOs,
            deviceToken: body.deviceToken
        };

        if (!body || !login || !pass) {
            err = new Error('Bad Request');
            err.status = 400;
            return next(err);
        }

        User
            .findOne({login: login, pass: pass})
            .exec(function (err, model) {
                if (err) {
                    return next(err)
                }

                console.log('signInClient rout started ');

                if (!model) {
                    console.log('No one model was found');
                    return res.status(400).send({ err: RESPONSE.AUTH.INVALID_CREDENTIALS});
                }

                console.log('find succesful ');
                console.log(model._id.toString(), ' userType: ', model.userType);

                var deviceOptions = {
                    model: model,
                    device: device
                };

                processDeviceToken(deviceOptions, function () {
                    return session.register(req, res, model._id.toString(), model.userType);
                });
            });
    };

    function processDeviceToken(options, callback) {
        var found = false;
        var model = options.model;
        var device = options.device;

        if (!options.device.deviceToken || !isValidDeviceOs(options.device.deviceOs)) {
            return callback();
        }

        for (var i = model.devices.length - 1; i >= 0; i--) {
            if (model.devices[i].deviceToken === device.deviceToken) {
                found = true;
            }
        }

        if (found) {
            return callback();
        }

        console.log('update Device',model._id );
        User
            .update({_id: model._id}, {$push: {'devices': device}}, function (err, data) {
                if (err) {
                    console.log(err.stack);
                }
                return callback();
            });
    }

    this.signOutClient = function (req, res, next) {
        var body = req.body;
        var device = {
            deviceOs: body.deviceOs,
            deviceToken: body.deviceToken
        };

        var found;

        if (!isLoginedAndValidDeviceToken(req, device)) {
            return session.kill(req, res, next);
        }
        var userId = req.session.uId;

        getUserById(userId, function (err, model) {
            console.dir(model);

            if (!model) {
                console.log('No one model was found');
                return session.kill(req, res, next);
            }

            console.log('find succesful ');
            console.log(model._id.toString(), ' userType: ', model.userType);

            var deviceOptions = {
                model: model,
                device: device
            };

            processDeviceToken(deviceOptions, function () {
                return session.kill(req, res, next);
            });

        });

        console.log('signOutClient rout started');
    };

    function isLoginedAndValidDeviceToken (req, device){
        return req.session && req.session.uId && req.session.loggedIn && device.deviceToken && isValidDeviceOs(device.deviceOs);
    }

    this.createAccount = function (req, res, next) {
        var body = req.body;
        var login = body.login;
        var pass = body.pass;
        var userType = body.userType;
        var user;
        var profile;
        var err;
        var device = {
            deviceOs: body.deviceOs,
            deviceToken: body.deviceToken
        };

        console.log(device);

        if (!userTypeValidate(userType)) {
            return res.status(400).send({err: RESPONSE.NOT_ENOUGH_PARAMS});

        }

        if (!device.deviceOs || !device.deviceToken || !isValidDeviceOs(device.deviceOs)) {
            user = new User({login: login, pass: pass, userType: userType});
        } else {
            user = new User({login: login, pass: pass, userType: userType, devices: device});
        }

        console.log('createAccount rout started');

        if (!body || !login || !pass) {
            err = new Error(RESPONSE.NOT_ENOUGH_PARAMS);
            err.status = 400;
            return next(err);
        }
        user.save(function (err, user) {
            if (err) {
                return res.status(500).send(err)
            }
            console.log('User save');

            body.owner = user._id;
            profile = new Profile(body);

            profile.save(function (err, profile) {
                if (err) {
                    return res.status(500).send(err)
                }

                res.status(200).send({userId: user._id});
            });
        });
    };



    /*TODO remove*/
    /*TEST BLOCK*/
};

module.exports = User;