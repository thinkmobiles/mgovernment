var SessionHandler = require('./sessions');
var CONST = require('../constants');
var RESPONSE = require('../constants/response');
var HistoryHandler = require('./adminHistoryLog');

var User = function(db) {
    'use strict';

    var mongoose = require('mongoose');
    var ObjectId = mongoose.Types.ObjectId;
    var session = new SessionHandler(db);

    var lodash = require('lodash');
    var async = require('async');
    var User = db.model(CONST.MODELS.USER);
    var Service = db.model(CONST.MODELS.SERVICE);

    var crypto = require('crypto');
    var adminHistoryHandler = new HistoryHandler(db);
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
            serviceName: body.serviceName,
            serviceOptions:body.serviceOptions,
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
                return res.status(400).send({ error: RESPONSE.ON_ACTION.NOT_FOUND});
            }

            User
                .update({'_id': user._id, 'accounts.seviceName': account.seviceName }, {$set: {
                    'accounts.$': account}}, function (err, data) {
                    if (err) {
                        return res.status(400).send({ error: err});
                    }
                    return res.status(200).send({ success: 'Account for Service:' + account.seviceName + 'was succesful updating'});
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

            if (user.favorites) {

                for (var i = user.accounts.length - 1; i >= 0; i--) {
                    if (user.accounts[i].seviceName === account.seviceName) {
                        found = true;
                    }
                }
            }
            if (found) {
                return res.status(400).send({ error: 'You already have same service'});
            }

            User
                .update({_id: user._id}, {$push: {'accounts': account}}, function (err, data) {
                    if (err) {
                    }
                    return res.status(200).send({ success: 'Account for Service:' + account.seviceName + 'was succesful created'});
                });
        });
    };

    this.addServiceToFavorites = function ( req, res, next ) {
        var serviceNames = req.body.serviceNames;
        var userId = req.session.uId;
        var resultServiceNames = [];
        var found = false;

        console.log('serviceNames:', serviceNames);
        console.log('userId:', userId);

        getUserById(userId, function (err, user) {
            // console.dir(user);
            user = user.toJSON();

            if (user.favorites) {

                for (var j = serviceNames.length - 1; j >= 0; j--) {
                    for (var i = user.favorites.length - 1; i >= 0; i--) {
                        if (user.favorites[i] == serviceNames[j]) {
                            found = true;
                            //console.log(user.favorites[i],' = ',serviceNames[j], ' (',found,'}' );
                        }
                    }
                    if (!found) {
                        resultServiceNames.push(serviceNames[j]);
                    }
                    found = false;
                }
            }

            User
                .update({_id: user._id}, {$push: {'favorites': {$each: resultServiceNames}}}, function (err, data) {
                    if (err) {
                        return res.status(400).send({error: err});
                    }
                    return res.status(200).send({success: RESPONSE.ON_ACTION.SUCCESS});
                });
        });
    };

    this.deleteServiceToFavorites = function ( req, res, next ) {
        var serviceNames = req.body.serviceNames;
        var userId = req.session.uId;
        var resultServiceNames = [];
        var found = false;

        getUserById(userId, function (err, user) {
            // console.dir(user);
            user = user.toJSON();

            if (user.favorites) {

                for (var i = user.favorites.length - 1; i >= 0; i--) {
                    for (var j = serviceNames.length - 1; j >= 0; j--) {
                        if (user.favorites[i] == serviceNames[j]) {
                            found = true;
                            //console.log(user.favorites[i],' = ',serviceNames[j], ' (',found,'}' );
                        }
                    }
                    if (!found) {
                        resultServiceNames.push(user.favorites[i]);
                    }
                    found = false;
                }
            }
            //console.log('serviceNames:', serviceNames);
            //console.log('resultServiceNames:', resultServiceNames);

            User
                .update({_id: user._id}, {$set: {
                    'favorites': resultServiceNames}}, function (err, data) {
                    if (err) {
                        return res.status(400).send({error: err});
                    }
                    return res.status(200).send({success: RESPONSE.ON_ACTION.SUCCESS});
                });
        });
    };

    this.getServicesFromFavorites = function ( req, res, next ) {
        var userId = req.session.uId;

        User
            .findOne({_id: userId})
            //.populate('favorites')
            .exec(function (err, model) {

                if (err) {
                    return res.status(400).send({error: err});
                }
                console.log(model.toJSON());
                return res.status(200).send(model.toJSON().favorites);

            })
    };

    this.getServicesAccountById = function ( req, res, next ) {
        var body = req.body;
        var userId = req.session.uId;
        var serviceId= req.params.serviceId;
        var found = false;
        var foundNumber = -1;

        getUserById(userId, function (err, user) {
            //  console.dir(user);
            user = user.toJSON();

            for (var i = user.accounts.length - 1; i >= 0; i--) {
                if (user.accounts[i].serviceId === serviceId) {
                    foundNumber = i;
                    found = true;
                }
            }
            if (!found) {
                return res.status(400).send({ error: RESPONSE.ON_ACTION.NOT_FOUND});
            }

            return res.status(200).send(user.accounts[foundNumber]);
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
            .select( 'login userType devices profile favorites accounts')
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

                    return res.status(400).send({error: RESPONSE.AUTH.INVALID_CREDENTIALS});
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

    this.adminSignIn = function (req, res, next) {

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

                if (!model || model.toJSON().userType != CONST.USER_TYPE.ADMIN) {

                    return res.status(400).send({ error: RESPONSE.AUTH.INVALID_CREDENTIALS});
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
            lastName: body.lastName,
            gender: body.gender,
            phone: body.phone
        };
        var account = {
            seviceName: body.seviceName,
            seviceOptions:body.seviceName,
            serviceLogin: body.serviceLogin,
            servicePass: body.servicePass
        };

        if (!isValidUserType(userType)) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
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
                    user: req.session.uId,
                    action: CONST.ACTION.CREATE,
                    model: CONST.MODELS.USER,
                    modelId: user._id,
                    description:'Create users account'
                };

                adminHistoryHandler.pushlog(log);

                res.status(200).send(user);
            });
    };

    this.registerClient = function (req, res, next) {

        var body = req.body;
        var login = body.login;
        var pass = body.pass;
        var gender = body.gender;
        var phone = body.phone;
        var userType = CONST.USER_TYPE.CLIENT;

        if (!body || !login || !pass || !gender || !phone) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        if (!(gender === 'male' || gender === 'female')) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS + ': incorrect gender (male/female)'});
        }

        var profile = {
            gender: gender,
            phone: phone
        };

        var shaSum = crypto.createHash('sha256');
        shaSum.update(pass);
        pass = shaSum.digest('hex');

        var userData = {login: login, pass: pass, userType: userType, profile: profile};

        User
            .findOne({login: login})
            .exec(function (err, model) {
                if (err) {
                    return next(err);
                }
                if (model) {
                    return res.status(400).send({error: RESPONSE.AUTH.REGISTER_LOGIN_USED});
                }

                var user = new User(userData);
                user
                    .save(function (err, user) {
                        if (err) {
                            return res.status(500).send({error: err});
                        }

                        return res.status(200).send({success: RESPONSE.AUTH.REGISTER});
                    });
            });
    };

    this.updateAccount = function (req, res, next) {

        var body = req.body;
        var login = body.login;
        var pass = body.pass;
        var gender = body.gender;
        var phone = body.phone;
        var userType = body.userType;
        var userId = req.params.id;
        var err;

        var device = {
            deviceOs: body.deviceOs,
            deviceToken: body.deviceToken
        };

        var profile = {
            firstName: body.firstName,
            lastName: body.lastName,
            gender: body.gender,
            phone: body.phone,
            createdAt: new Date()
        };

        if (!isValidUserType(userType)) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
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

        getUserById(userId, function (err, user) {
            user = user.toJSON();
            console.dir(user);

            User
                .update({'_id': user._id}, {$set: userData}, function (err, data) {
                    if (err) {
                        return res.status(400).send({ error: err});
                    }

                    var log = {
                        user: req.session.uId,
                        action: CONST.ACTION.UPDATE,
                        model: CONST.MODELS.USER,
                        modelId: user._id,
                        description:'Update users account'
                    };

                    adminHistoryHandler.pushlog(log);
                    return res.status(200).send({ success: 'User was succesful updating'});
                });
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
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        User
            .findOne(searchQuery)
            .remove()
            .exec(function (err, model) {

                if (err) {
                    return next(err);
                }
                var log = {
                    user: req.session.uId,
                    action: CONST.ACTION.DELETE,
                    model: CONST.MODELS.USER,
                    modelId: req.params.id,
                    description:'Delete users account'
                };

                adminHistoryHandler.pushlog(log);

                return res.status(200).send({success: RESPONSE.ON_ACTION.SUCCESS});
            });
    };

    //TODO REMOVE - test image upload
    this.updateUserImage = function(req, res, next) {

    };

    this.getUserImage = function(req, res, next) {

    }
};

module.exports = User;