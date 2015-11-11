'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var CONST = require('../../constants/index');
var USERS = require('./../testHelpers/usersTemplates');
var SERVICES = require('./../testHelpers/servicesTemplates');
var async = require ('async');
var PreparingBd = require('./preparingDb');

var app = require('../../app');

describe('User CRM Register / LogIn / LogOut', function () {
    this.timeout(10000);

    var agent = request.agent(app);
    var preparingDb = new PreparingBd();

    before(function (done) {
        this.timeout(50000);
        console.log('>>> before');

        async.series([
            preparingDb.dropCollection(CONST.MODELS.USER + 's'),
            preparingDb.toFillUsers(1)
        ], function (err,results)   {
            if (err) {
                return done(err)
            }
            done();
        });
    });

    it('Login with GOOD credentials', function (done) {
        this.timeout(20000);

        var loginData = {
            login: USERS.CLIENT_CRM_LOGIN_TAREK.login,
            pass: USERS.CLIENT_CRM_LOGIN_TAREK.pass
        };

        agent
            .post('/crm/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                preparingDb
                    .User
                    .findOne({login: loginData.login})
                    .exec(function (err, model) {
                        if (err) {
                            return done(err);
                        }

                        if (!model) {
                            return done('Not Exist Middleware user');
                        }

                        done();
                    });
            });
    });

    it('Login with BAD credentials - wrong pass', function (done) {

        var loginData = {
            login: USERS.CLIENT_CRM_LOGIN_TAREK.login,
            pass: USERS.CLIENT_CRM_LOGIN_TAREK.pass + 'badpass'
        };

        agent
            .post('/crm/signIn')
            .send(loginData)
            .expect(400)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                done();
            });
    });

    it('Register crm user', function (done) {
        this.timeout(60000);

        var registerData = USERS.CLIENT_REGISTER_DATA;

        agent
            .post('/crm/signOut')
            .send({})
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/crm/register')
                    .send(registerData)
                    .expect(200)
                    .end(function (err, res) {
                       console.dir(res.body);
                        if (err) {
                            return done(err)
                        }
                        console.log(res.body);

                        preparingDb
                            .User
                            .findOne({login: registerData.login})
                            .exec(function (err, model) {
                                console.dir(res.body);
                                if (err) {
                                    return done(err);
                                }

                                if (!model) {
                                    return done('Not Exist Middleware user');
                                }

                                done();
                            });
                    });
            });
    });

    it('Register crm user with Same Email', function (done) {
        this.timeout(60000);

        var registerData = {
            login: USERS.CLIENT_REGISTER_DATA.login + 'newLogin',
            pass: USERS.CLIENT_REGISTER_DATA.pass,
            first: USERS.CLIENT_REGISTER_DATA.first,
            last: USERS.CLIENT_REGISTER_DATA.last,
            emiratesId: USERS.CLIENT_REGISTER_DATA.emiratesId,
            state: 3,
            mobile: USERS.CLIENT_REGISTER_DATA.mobile,
            email: USERS.CLIENT_REGISTER_DATA.email
        };

        agent
            .post('/crm/signOut')
            .send({})
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/crm/register')
                    .send(registerData)
                    .expect(400)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        console.log(res.body);

                        done();
                    });
            });
    });

    it('Login with registered GOOD credentials', function (done) {

        var loginData = {
            login: USERS.CLIENT_REGISTER_DATA.login,
            pass: USERS.CLIENT_REGISTER_DATA.pass
        };

        agent
            .post('/crm/signOut')
            .send({})
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                agent
                    .post('/crm/signIn')
                    .send(loginData)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }

                        preparingDb
                            .User
                            .findOne({login: loginData.login})
                            .exec(function (err, model) {
                                if (err) {
                                    return done(err);
                                }

                                if (!model) {
                                    return done('Not Exist Middleware user');
                                }

                                done();
                            });
                    });
            });
    });

    it('Register same user', function (done) {
        this.timeout(60000);

        var registerData = USERS.CLIENT_REGISTER_DATA;

        agent
            .post('/crm/signOut')
            .send({})
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/crm/register')
                    .send(registerData)
                    .expect(400)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        done();
                    });
            });
    });

    it('Register user with BAD values', function (done) {
        this.timeout(60000);

        var registerData = {
            login: 555,
            pass: 'password777',
            last: 'Digi',
            emiratesId: '784-1990-NNNNNNN-C',
            state: 3,
            mobile: '+987654321',
            email: 'ss.sdsd.gmail.com'
        };

        agent
            .post('/crm/signOut')
            .send({})
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/crm/register')
                    .send(registerData)
                    .expect(400)
                    .end(function (err, res) {
                        console.dir(res.body);
                        if (err) {
                            return done(err)
                        }
                        done();
                    });
            });
    });

});