'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var CONST = require('../../constants/index');
var USERS = require('./../testHelpers/usersTemplates');
var async = require ('async');
var PreparingBd = require('./preparingDb');

var app = require('../../app');

describe('User TDA Services', function () {
    this.timeout(10000);

    var agent = request.agent(app);
    var preparingDb = new PreparingBd();

    before(function (done) {
        this.timeout(30000);
        console.log('>>> before');

        async.series([
            preparingDb.dropCollection(CONST.MODELS.USER + 's'),
            preparingDb.toFillUsers(1)
        ], function (err, results) {
            if (err) {
                return done(err)
            }
            done();
        });
    });

    it('Request for supplier of telecom devices (register dealer)', function (done) {

        var loginData = {
            username: USERS.CLIENT_TDA_DATA.username,
            password: USERS.CLIENT_TDA_DATA.password,
            userType: USERS.CLIENT_TDA_DATA.userType
        };

        agent
            .post('/tda/register')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                console.dir(res.body);

                done();
            });
    });

    it('Renew for supplier of telecom devices (renew dealer certification)', function (done) {

        var loginData = {
            username: USERS.CLIENT_TDA_DATA.username,
            password: USERS.CLIENT_TDA_DATA.password,
            userType: USERS.CLIENT_TDA_DATA.userType
        };

        agent
            .post('/tda/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/tda/renewCert')
                    .send({
                        cert: '12123'
                    })
                    .expect(400)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }

                        done();
                    });
            });
    });

    it('Update info of supplier of telecom devices (modify dealer profile)', function (done) {

        var loginData = {
            username: USERS.CLIENT_TDA_DATA.username,
            password: USERS.CLIENT_TDA_DATA.password,
            userType: USERS.CLIENT_TDA_DATA.userType
        };

        agent
            .post('/tda/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .put('/tda/profile')
                    .send({

                    })
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        console.dir(res.body);

                        done();
                    });
            });
    });

    it('Request for registration of telecom devices (Equipment registration)', function (done) {

        var loginData = {
            username: USERS.CLIENT_TDA_DATA.username,
            password: USERS.CLIENT_TDA_DATA.password,
            userType: USERS.CLIENT_TDA_DATA.userType
        };

        agent
            .post('/tda/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/tda/equipment')
                    .send({

                    })
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        console.dir(res.body);

                        done();
                    });
            });
    });

    it('Renew for registration of telecom devices (Renew Equipment registration)', function (done) {

        var loginData = {
            username: USERS.CLIENT_TDA_DATA.username,
            password: USERS.CLIENT_TDA_DATA.password,
            userType: USERS.CLIENT_TDA_DATA.userType
        };

        agent
            .put('/tda/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .put('/tda/equipment')
                    .send({

                    })
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        console.dir(res.body);

                        done();
                    });
            });
    });

    it('Customs clearance', function (done) {

        var loginData = {
            username: USERS.CLIENT_TDA_DATA.username,
            password: USERS.CLIENT_TDA_DATA.password,
            userType: USERS.CLIENT_TDA_DATA.userType
        };

        agent
            .post('/tda/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .get('/tda/customClearance')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }

                        console.dir(res.body);
                        expect(res.body).to.be.instanceof(Array);

                        done();
                    });
            });
    });

});