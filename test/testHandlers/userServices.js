'use strict';

var request = require('supertest');
var mongoose = require('mongoose');
var async = require('async');

var CONST = require('../../constants/index');
var USERS = require('./../testHelpers/usersTemplates');
var SERVICES = require('./../testHelpers/servicesTemplates');

var url = 'http://localhost:7791';

describe('Service User: GET options, POST send request', function () {

    var userId;
    var agent = request.agent(url);

    before(function (done) {
        console.log('>>> before');

        var connectOptions = {
            db: {native_parser: false},
            server: {poolSize: 5},
            user: process.env.DB_USER,
            pass: process.env.DB_PASS,
            w: 1,
            j: true,
            mongos: true
        };

        var dbConnection = mongoose.createConnection(process.env.DB_HOST, process.env.DB_NAME, process.env.DB_PORT, connectOptions);

        dbConnection.once('open', function callback() {

            async.series([
                    function (callback) {
                        dbConnection.db.dropCollection(CONST.MODELS.USER + 's', callback);
                    },
                    function (callback) {
                        dbConnection.db.dropCollection(CONST.MODELS.SERVICE + 's', callback);
                    },
                    function (callback) {
                        var models = require('../../models/index')(dbConnection);
                        var User = dbConnection.model(CONST.MODELS.USER);
                        var crypto = require('crypto');
                        createDefaultAdmin();

                        function createDefaultAdmin() {
                            User
                                .findOne({userType: CONST.USER_TYPE.ADMIN})
                                .exec(function (err, model) {
                                    if (model) {
                                        return callback();
                                    }
                                    var pass = USERS.ADMIN_DEFAULT.pass;

                                    var shaSum = crypto.createHash('sha256');
                                    shaSum.update(pass);
                                    pass = shaSum.digest('hex');

                                    var admin = new User({
                                        login: USERS.ADMIN_DEFAULT.login,
                                        pass: pass,
                                        userType: CONST.USER_TYPE.ADMIN
                                    });

                                    admin
                                        .save(function (err, user) {
                                            if(err){
                                                return callback(err);
                                            }
                                            callback();
                                        });
                                });
                        }
                    }
                ],
                function (err, result) {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });
    });

    it('Admin Create Service For ALL', function (done) {

        var loginData = USERS.ADMIN_DEFAULT;
        var data = SERVICES.SERVICE_SPEDTEST_INET;

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/adminService/')
                    .send(data)
                    .expect(201)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        console.log(res.body._id);
                        done();
                    });
            });
    });

    it('Admin Create Service For Client', function (done) {

        var loginData = USERS.ADMIN_DEFAULT;
        var data = SERVICES.SERVICE_SPEDTEST_INET;

        data.serviceName = data.serviceName + 'Client';
        data.forUserType = [CONST.USER_TYPE.CLIENT, CONST.USER_TYPE.ADMIN];

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/adminService/')
                    .send(data)
                    .expect(201)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        console.log(res.body._id);
                        done();
                    });
            });
    });

    it('Admin Create Service For Company', function (done) {

        var loginData = USERS.ADMIN_DEFAULT;
        var data = SERVICES.SERVICE_SPEDTEST_INET;

        data.serviceName = data.serviceName + 'Company';
        data.forUserType = [CONST.USER_TYPE.COMPANY, CONST.USER_TYPE.ADMIN];

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/adminService/')
                    .send(data)
                    .expect(201)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        console.log(res.body._id);
                        done();
                    });
            });
    });

    it('Admin Create Service For Government', function (done) {

        var loginData = USERS.ADMIN_DEFAULT;
        var data = SERVICES.SERVICE_SPEDTEST_INET;

        data.serviceName = data.serviceName + 'Government';
        data.forUserType = [CONST.USER_TYPE.GOVERNMENT, CONST.USER_TYPE.ADMIN];

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/adminService/')
                    .send(data)
                    .expect(201)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        console.log(res.body._id);
                        done();
                    });
            });
    });

    it('Guest uses Client Service', function (done) {

        agent
            .post('/user/signOut')
            .send({})
            .expect(200)
            .end(function (err, res) {

                if (err) {
                    return done(err)
                }
                done();
            });

    });

});