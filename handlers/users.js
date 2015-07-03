var SessionHandler = require('./sessions');
var CONST = require('../constants');
var RESPONSE = require('../constants/response');
var HistoryHandler = require('./historyLog');

var User = function(db) {

    var mongoose = require('mongoose');
    var session = new SessionHandler(db);

    var lodash = require('lodash');
    var async = require('async');
    var User = db.model(CONST.MODELS.USER);
    var crypto = require('crypto');
    var historyHandler = new HistoryHandler(db);
    createDefaultAdmin();

    function createDefaultAdmin() {
        User
            .findOne({userType:'admin'})
            .exec(function (err, model) {
                if (!model) {
                    var pass = 'defaultAdmin';

                    var shaSum = crypto.createHash('sha256');
                    shaSum.update(pass);
                    pass = shaSum.digest('hex');

                    var admin = new User({
                        login: 'defaultAdmin',
                        pass: pass,
                        userType: 'admin'
                    });

                    admin
                        .save(function (err, user) {
                            if (user) {
                                console.log('Default Admin Created');
                            }
                        });
                }
            });
    }

    function isValidUserType(userType) {
        var validate = false;
        for (var k in CONST.USER_TYPE) {
            if  (CONST.USER_TYPE[k] === userType) {
                validate = true;
            }
        }
        return validate;
    }

    function isValidDeviceOs(deviceOs){
        var validate = false;
        for (var k in CONST. DEVICE_TYPE) {
            if  (CONST. DEVICE_TYPE[k] === deviceOs) {
                validate = true;
            }
        }
        return validate;
    }

    this.updateServicesAccount = function ( req, res, next ) {
        var body = req.body;
        var userId = req.session.uId;
        var found = false;
        var foundPosition= -1;
        var account = {
            seviceName: body.seviceName,
            seviceOptions:body.seviceOptions,
            serviceLogin: body.serviceLogin,
            servicePass: body.servicePass
        };

        getUserById(userId, function (err, user) {
            user = user.toJSON();
            console.dir(user);

            for (var i = user.accounts.length - 1; i >= 0; i--) {
                if (user.accounts[i].seviceName === account.seviceName) {
                    found = true;
                    foundPosition = i;
                }
            }
            if (!found) {
                return res.status(400).send({ err: RESPONSE.ON_ACTION.NOT_FOUND});
            }

            User
                .update({'_id': user._id, 'accounts.seviceName': account.seviceName }, {$set: {
                    'accounts.$': account}}, function (err, data) {
                    if (err) {
                        return res.status(400).send({ err: err});
                    }
                    return res.status(200).send({ succes: 'Account for Service:' + account.seviceName + 'was succesful updating'});
                });
        });
    };

    this.getUserProfileByIdForAdmin = function ( req, res, next ) {

        var userId = req.params.id;

        getUserById(userId, function (err, profile) {

            profile = profile.toJSON();
            if (err) {
                return next(err);
            }
            return res.status(200).send(profile);
        });
    };

    this.getUserProfileBySession = function ( req, res, next ) {

        var userId = req.session.uId;
        getUserById(userId, function (err, profile) {
            profile = profile.toJSON();
            if (err) {
                return next(err);
            }
            return res.status(200).send(profile);
        });
    };

    this.createServicesAccount = function ( req, res, next ) {
        var body = req.body;
        var userId = req.session.uId;
        var found = false;
        var account = {
            seviceName: body.seviceName,
            seviceOptions:body.seviceOptions,
            serviceLogin: body.serviceLogin,
            servicePass: body.servicePass
        };

        getUserById(userId, function (err, user) {
            console.dir(user);
            user = user.toJSON();

            for (var i = user.accounts.length - 1; i >= 0; i--) {
                if (user.accounts[i].seviceName === account.seviceName) {
                    found = true;
                }
            }
            if (found) {
                return res.status(400).send({ err: 'You already have same service'});
            }

            User
                .update({_id: user._id}, {$push: {'accounts': account}}, function (err, data) {
                    if (err) {
                    }
                    return res.status(200).send({ succes: 'Account for Service:' + account.seviceName + 'was succesful created'});
                });
        });

    };


    this.isAdminBySession = function ( req, res, next ) {

        var userId = req.session.uId;

        getUserById(userId, function (err, profile) {
            profile = profile.toJSON();
            console.dir(profile);
            if (profile.userType === CONST.USER_TYPE.ADMIN) {
                return next();
            }

            err = new Error(RESPONSE.AUTH.NO_PERMISSIONS);
            err.status = 403;
            return next(err);

        });
    };

    this.getUserProfiles = function (req, res, next) {
        var sortField = req.query.orderBy || 'createdAt';
        var sortDirection = +req.query.order || 1;
        var sortOrder = {};
        sortOrder[sortField] = sortDirection;

        var skipCount = ((req.query.page - 1) * req.query.count) || 0;
        var limitCount = req.query.count || 20;

        User
            .find({})
            .select( 'login userType devices profile accounts')
            .sort(sortOrder)
            .skip(skipCount)
            .limit(limitCount)
            .exec(function (err, collection) {
                if (err) {
                    return next(err);
                }

                return res.status(200).send(collection);
            });
    };

    function getUserById (userId, callback){

        User
            .findOne({_id: userId})
            .select( 'login userType devices profile accounts')
            .exec(function (err, model) {
                if (err) {
                    return callback(err);
                }

                if (model) {

                    return callback(null, model);
                } else {
                    return callback(new Error( RESPONSE.ON_ACTION.NOT_FOUND + ' with such _id '));
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
            err = new Error(RESPONSE.ON_ACTION.BAD_REQUEST);
            err.status = 400;
            return next(err);
        }

        var shaSum = crypto.createHash('sha256');
        shaSum.update(pass);
        pass = shaSum.digest('hex');

        User
            .findOne({login: login, pass: pass})
            .exec(function (err, model) {
                if (err) {
                    return next(err)
                }

                if (!model) {

                    return res.status(400).send({ err: RESPONSE.AUTH.INVALID_CREDENTIALS});
                }

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

        if (!device.deviceToken || !isValidDeviceOs(device.deviceOs)) {
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

        User
            .update({_id: model._id}, {$push: {'devices': device}}, function (err, data) {
                if (err) {

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

        if (!isLoginedAndValidDeviceToken(req, device)) {
            return session.kill(req, res, next);
        }
        var userId = req.session.uId;

        getUserById(userId, function (err, model) {
            model = model.toJSON();
            console.dir(model);

            if (!model) {

                return session.kill(req, res, next);
            }

            var deviceOptions = {
                model: model,
                device: device
            };

            processDeviceToken(deviceOptions, function () {
                return session.kill(req, res, next);
            });
        });
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
        var err;
        var device = {
            deviceOs: body.deviceOs,
            deviceToken: body.deviceToken
        };
        var profile = {
            firstName: body.firstName,
            lastName: body.lastName
        };
        var account = {
            seviceName: body.seviceName,
            seviceOptions:body.seviceName,
            serviceLogin: body.serviceLogin,
            servicePass: body.servicePass
        };

        if (!isValidUserType(userType)) {
            return res.status(400).send({err: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        if (!body || !login || !pass) {
            err = new Error(RESPONSE.NOT_ENOUGH_PARAMS);
            err.status = 400;
            return next(err);
        }

        var shaSum = crypto.createHash('sha256');
        shaSum.update(pass);
        pass = shaSum.digest('hex');

        var userData ={login: login, pass: pass, userType: userType, profile: profile};

        if (device.deviceOs && device.deviceToken && isValidDeviceOs(device.deviceOs)) {
            userData.devices = [device];
        }

        if (account.seviceName && account.serviceLogin && account.servicePass) {
            userData.accounts = [account];
        }

        user = new User(userData);
        user.
            save(function (err, user) {
                if (err) {
                    return res.status(500).send(err)
                }

                var log = {
                    userId: req.session.uId,
                    action: CONST.ACTION.CREATE,
                    model: CONST.MODELS.USER,
                    modelId: user._id,
                    description:'Create users account'
                };

                historyHandler.pushlog(log);

                res.status(200).send(user);
            });
    };

    this.getCount = function (req, res, next) {

        User
            .count({}, function (err, count) {
                if (err) {
                    return next(err);
                }
                return res.status(200).send({count: count});
            });
    };

    this.deleteUserProfileByIdForAdmin = function (req, res, next) {
        var searchQuery = {
            '_id': req.params.id
        };

        if (!searchQuery._id) {
            return res.status(400).send({err: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        User
            .findOne(searchQuery)
            .remove()
            .exec(function (err, model) {

                if (err) {
                    return next(err);
                }

                return res.status(200).send({result: RESPONSE.ON_ACTION.SUCCESS});
            });
    };

    /*TODO remove*/
    /*TEST BLOCK*/
};

module.exports = User;