'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var app = require('../app');
var mongoose = require('mongoose');
var CONST = require('../constants');
var LAYUOTS = require('./testHelpers/layoutsTemplates');
var USERS = require('./testHelpers/usersTemplates');
var async = require ('async');

var url = 'http://localhost:7791';

describe('User create/ logIn / logOut / getProfile / Device, Account (CRUD) ,', function () {

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
            dbConnection.db.dropCollection('Users', function (err, result) {
                console.log('Collection Users dropped');
            });

            dbConnection.db.dropCollection('HistoryLog', function (err, result) {
                console.log('Collection HistoryLog dropped');
                done();
            });
        });


    });

    it('Create user', function (done) {

        var loginData = USERS.ADMIN_DEFAULT;
        var data = USERS.CLIENT_GOOD_USER_TYPE;

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/user/')
                    .send(data)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        expect(res.body).to.have.property('login');
                        expect(res.body).to.have.property('pass');
                        expect(res.body).to.have.property('userType');
                        expect(res.body.login).to.equal('client123');
                        done();
                    });
            });

    });

    it('Login with GOOD credentials (client123, pass1234)', function (done) {

        var loginData = USERS.CLIENT_GOOD_USER_TYPE;

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                done();
            });
    });

    it('Login with BAD credentials - wrong pass (client123, 123456)', function (done) {

        var loginData = USERS.CLIENT_BAD_PASSWORD;

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(400)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                done();
            });
    });

    it('SignOut if Logined (client123, pass1234)', function (done) {

        var loginData = {
            login: 'client123',
            pass: 'pass1234',
            deviceOs: "android",
            deviceToken: "Pilesos Token12343"
        };

        var loginData2 = {
            login: 'client123',
            pass: 'pass1234',
            deviceOs: "android",
            deviceToken: "Skovoroda Token12343"
        };

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/user/signOut')
                    .send(loginData2)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        done();
                    });
            });
    });

    it('SignOut if Unauthorized (client123, pass1234)', function (done) {
        var loginData = {
            login: 'client123',
            pass: 'pass1234',
            deviceOs: "ois--- bad IoS",
            deviceToken: "IClock  Token-----------------"
        };

        agent
            .post('/user/signOut')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                done();
            });

    });

    it('Get UserProfile By Session if Unauthorized (client123, pass1234)', function (done) {

        var loginData = {
            login: 'client123',
            pass: 'pass1234',
            deviceOs: "ois",
            deviceToken: "IClock  Token----"
        };

        agent
            .get('/user/profile')
            .send(loginData)
            .expect(401)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                done();
            });
    });

    it('Get UserProfile By Session after logIn  (client123, pass1234)', function (done) {

        var loginData = {
            login: 'client123',
            pass: 'pass1234',
            deviceOs: "windows",
            deviceToken: "Nokia  Token----"
        };

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .get('/user/profile')
                    .send(loginData)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        done();
                    });
            });
    });

    it('Get user by ID with client userType (client123, pass1234)', function (done) {

        agent
            .get('/user/profile/545465465464654')
            .expect(403)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                } else {
                    done();
                }
            });
    });

    it('Get user by BAD ID with admin userType (admin123, pass1234)', function (done) {

        var data = USERS.ADMIN;
        var loginData = USERS.ADMIN_DEFAULT;

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/user/')
                    .send(data)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        agent
                            .post('/user/signIn')
                            .send(data)
                            .expect(200)
                            .end(function (err, res) {
                                if (err) {
                                    return done(err)
                                }
                                agent
                                    .get('/user/profile/545465465464654')
                                    .expect(500)
                                    .end(function (err, res) {
                                        if (err) {
                                            return done(err);
                                        } else {
                                            done();
                                        }
                                    });
                            });
                    });
            });
    });


    it('POST Service account (client123, pass1234)', function (done) {

        var loginData = USERS.CLIENT_PLUS_ACCOUNT;

        agent
            .post('/user/account')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                done();
            });
    });

    it('POST duplicate Service account (client123, pass1234)', function (done) {

        var loginData =  USERS.CLIENT_PLUS_ACCOUNT;

        agent
            .post('/user/account')
            .send(loginData)
            .expect(400)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                done();
            });
    });

    it('PUT  Service account (client123, pass1234)', function (done) {

        var loginData =  USERS.CLIENT_CHANGE_ACCOUNT;

        agent
            .put('/user/account')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                done();
            });
    });

    it('Admin Create 40 Users', function (done) {

        var loginData = USERS.ADMIN_DEFAULT;

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                var layoutsCount = 0;
                var createUsersArray = [];

                for (var i = 40; i > 0; i--) {
                    createUsersArray.push(saveUser({
                        login: 'client123_' + i,
                        pass: 'pass1234_' + i,
                        userType: 'client'
                    }));
                }

                async.parallel(createUsersArray, function (err,results)   {
                    if (err) {
                        return done(err)
                    }
                    console.log('ASYNC layoutsCount: ', layoutsCount);
                    done();
                });
            });
    });



    it('Admin GET ALL USER with Query', function (done) {

        agent
            .get('/user/?orderBy=login&order=1&page=1&count=2')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                console.log('All users was get:');
                console.dir(res.body);
                done();
            });
    });

    it('Admin GET Count of Users', function (done) {

        agent
            .get('/user/getCount')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                console.log('Count of  Users was get:');
                console.dir(res.body);
                done();
            });
    });

    function saveUser(data) {
        return function (callback) {
            agent
                .post('/user/')
                .send(data)
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        return  callback(err)
                    }
                    callback();
                });
        }
    }

});
