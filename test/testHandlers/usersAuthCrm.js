'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var CONST = require('../../constants/index');
var USERS = require('./../testHelpers/usersTemplates');
var SERVICES = require('./../testHelpers/servicesTemplates');
var async = require ('async');
var PreparingBd = require('./preparingDb');
var url = 'http://localhost:80';

describe('User CRM register/ logIn / logOut', function () {
    this.timeout(10000);

    var agent = request.agent(url);
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
                        if (err) {
                            return done(err)
                        }

                        preparingDb
                            .User
                            .findOne({login: registerData.login})
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


});