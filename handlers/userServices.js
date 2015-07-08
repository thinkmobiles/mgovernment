var CONST = require('../constants');
var RESPONSE = require('../constants/response');
var UserHistoryHandler = require('./userHistoryLog');
var UserHandler = require('./users');
var SessionHandler = require('./sessions');
var request = require('request');
var request = request.defaults({jar: true});
var async = require('async');

var UserService = function(db) {

    var mongoose = require('mongoose');
    var Service = db.model(CONST.MODELS.SERVICE);
    var session = new SessionHandler(db);
    // var users = new UserHandler(db);
    var User = db.model(CONST.MODELS.USER);

    var userHistoryHandler = new UserHistoryHandler(db);

    this.getServiceOptions = function (req, res, next) {

        var searchQuery = {
            _id: req.params.serviceId
        };

        getServiceOptionsById(searchQuery, function (err, model) {

            var log = {
                userId: req.session.uId || 'Unauthorized',
                action: CONST.ACTION.GET,
                model: CONST.MODELS.SERVICE,
                modelId: searchQuery._id,
                req: {params: req.params, body: req.params},
                res: model,
                description: 'getServiceOptions'
            };
            userHistoryHandler.pushlog(log);

            if (err) {
                return res.status(400).send({err: 'Service Option not found'});
            }
            return res.status(200).send(model);
        })
    };

    this.getServices = function (req, res, next) {

        Service
            .find()
            .select('_id serviceProvider serviceName serviceType profile forUserType method baseUrl')
            //.select()
            .exec(function (err, collection) {
                if (err) {
                    return next(err);
                }

                var log = {
                    userId: req.session.uId || 'Unauthorized',
                    action: CONST.ACTION.GET,
                    model: CONST.MODELS.SERVICE,
                    modelId: '',
                    req: {params: req.params, body: req.params},
                    res: collection,
                    description: 'getServices'
                };
                userHistoryHandler.pushlog(log);

                return res.status(200).send(collection);
            });
    };

    this.sendServiceRequest = function (req, res, next) {

        var body = req.body;
        var userId = req.session.uId;
        var serviceId = req.params.serviceId;
        var found = false;
        var foundNumber = -1;
        var serviceOptions;
        var serviceAccount;
        var tasks =[];


        /// GET SERVICE Options BY ID
        tasks.push(getServiceOptions());

        function getServiceOptions() {
            return function (callback) {

                getServiceOptionsById(serviceId, function (err, model) {

                    if (err) {
                        //return res.status(400).send({err: 'Service Options not found '});
                        return callback(err);
                    }
                    serviceOptions = model.toJSON();
                    return callback();

                })
            };
        }

        /// GET UserAccountFor Service by session id
        tasks.push(getServiceAccesOptions());

        function getServiceAccesOptions() {
            return function (callback) {

                getUserById(userId, function (err, user) {
                    user = user.toJSON();

                    for (var i = user.accounts.length - 1; i >= 0; i--) {
                        if (user.accounts[i].serviceProvider == serviceOptions.serviceProvider) {
                            foundNumber = i;
                            found = true;
                        }
                    }
                    if (!found) {
                        //return res.status(400).send({err: 'Service Account not found'});
                        return callback('Service Account not found');
                    }
                    serviceAccount = user.accounts[foundNumber];
                    //  return res.status(200).send(user.accounts[foundNumber]);
                    return callback();
                });
            }
        }

/// Outside Server process Handler
        tasks.push(sendDataToCapalaba());

        function sendDataToCapalaba() {
            return function (callback) {

                var userCookiesObject;
                var userCookies;
                var userCookiesString;

                // Check cookie

                // good cookie & date, then function sendData

                // bad cookie, then sugnin, and  function sendData

                // SignIn

                async.series([userSignIn()], function (err,results){
                    if (err) {
                        console.log(err)
                        return callback(err);
                    }
                    return callback(null, results);
                });

                function userSignIn(){
                    return function (callback){

                        var SignInData = {
                            password: serviceAccount.pass,
                            username: serviceAccount.login
                        };

                        var serviceUrl = 'http://134.249.164.53:7788/signIn';
                        // var url = res.body.url;

                        userCookiesObject = request.jar();
                        request.post(serviceUrl, { headers: {'User-Agent': 'Kofevarka'}, jar: userCookiesObject, json: true, body: SignInData }, function (err, res, body) {
                            //request.post(serviceUrl, {'content-type': 'application/json', body:JSON.stringify(loginData)}, function (error, response, body) {
                            if (!err && res.statusCode == 200) {
                                console.log(' ----------------------------------------------------------- User LogIn:',body);
                                userCookiesString = userCookiesObject.getCookieString(serviceUrl); // "key1=value1; key2=value2; ..."
                                userCookies = userCookiesObject.getCookies(serviceUrl);
                                console.log('Cookies USER REQUEST:',userCookiesString );

                                return  callback(null,res.body)
                            }
                            return callback(err)
                        });
                    }
                }
            }
        }




        /// Choose service Handlers
        async.series(tasks, function (err,results){
            if (err) {
                return res.status(400).send(err);

            }

            var log = {
                //     userId: req.session.uId || 'Unauthorized',
                action: CONST.ACTION.POST,
                model: CONST.MODELS.SERVICE,
                modelId: '',
                ///       req: {params: req.params, body: req.params},
                res: {success: RESPONSE.ON_ACTION.SUCCESS},
                description: 'sendServiceRequest'
            };
            userHistoryHandler.pushlog(log);
            return res.status(200).send(results);


        });


    };

    function getUserById(userId, callback) {

        User
            .findOne({_id: userId})
            .select('login userType devices profile accounts')
            .exec(function (err, model) {
                if (err) {
                    return callback(err);
                }

                if (model) {

                    return callback(null, model);
                } else {
                    return callback(new Error(RESPONSE.ON_ACTION.NOT_FOUND + ' with such _id '));
                }
            });
    }

    function getServiceOptionsById(serviceId, callback) {

        Service
            .findOne({_id: serviceId})
            .exec(function (err, model) {
                if (err) {
                    return callback(err);
                }
                return callback(null, model);
            });
    }


};

module.exports = UserService;