var SessionHandler = require('./sessions');
var CONST = require('../constants');
var RESPONSE = require('../constants/response');

var User = function(db) {

    var mongoose = require('mongoose');
    var session = new SessionHandler(db);

    var lodash = require('lodash');
    var async = require('async');
    var User = db.model('user');

    function isValidUserType(userType) {
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
            console.dir(user);

            for (var i = user.accounts.length - 1; i >= 0; i--) {
                if (user.accounts[i].seviceName === account.seviceName) {
                    found = true;
                    foundPosition = i;
                }
            }
            if (!found) {
                return res.status(400).send({ err: 'Not find such serviceName'});
            }
           // user.accounts[i] = account

            console.log('update Account',user._id,' update store fo service: ', account.seviceName);

            User
                .update({'_id': user._id, 'accounts.seviceName': account.seviceName }, {$set: {
                    'accounts.$': account}}, function (err, data) {
                    if (err) {
                        console.log(err.stack);
                    }
                    return res.status(200).send({ succes: 'Account for Service:' + account.seviceName + 'was succesful updating'});
                });
        });
    };

    this.getUserProfileByIdForAdmin = function ( req, res, next ) {

        var userId = req.params.id;
        console.log ('userId: ',userId);

        getUserById(userId, function (err, profile) {
            if (err) {
                return next(err);
            }
            return res.status(200).send(profile);
        });
    };

    this.getUserProfileBySession = function ( req, res, next ) {

        var userId = req.session.uId;
        getUserById(userId, function (err, profile) {
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

            for (var i = user.accounts.length - 1; i >= 0; i--) {
                if (user.accounts[i].seviceName === account.seviceName) {
                    found = true;
                }
            }
            if (found) {
                return res.status(400).send({ err: 'You already have same service'});
            }

            console.log('update Account',user._id,' create store fo service: ', account.seviceName);
            User
                .update({_id: user._id}, {$push: {'accounts': account}}, function (err, data) {
                    if (err) {
                        console.log(err.stack);
                    }
                    return res.status(200).send({ succes: 'Account for Service:' + account.seviceName + 'was succesful created'});
                });
        });

    };


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
        console.log(device);

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

        // console.log(device);

        if (!isValidUserType(userType)) {
            return res.status(400).send({err: RESPONSE.NOT_ENOUGH_PARAMS});

        }

        console.log('createAccount rout started');

        if (!body || !login || !pass) {
            err = new Error(RESPONSE.NOT_ENOUGH_PARAMS);
            err.status = 400;
            return next(err);
        }

        var userData ={login: login, pass: pass, userType: userType, profile: profile};

        if (device.deviceOs && device.deviceToken && isValidDeviceOs(device.deviceOs)) {
            userData.devices = [device];
        }

        if (account.seviceName && account.serviceLogin && account.servicePass) {
            userData.accounts = [account];
        }


        user = new User(userData);
        console.log(userData);
        user.save(function (err, user) {
            if (err) {
                return res.status(500).send(err)
            }
            console.log('User save');


            res.status(200).send(user);
        });
    };



    /*TODO remove*/
    /*TEST BLOCK*/
};

module.exports = User;