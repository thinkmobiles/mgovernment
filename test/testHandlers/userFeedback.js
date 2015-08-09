'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var CONST = require('../../constants/index');
var USERS = require('./../testHelpers/usersTemplates');
var SERVICES = require('./../testHelpers/servicesTemplates');
var async = require ('async');
var PreparingBd = require('./preparingDb');
var url = 'http://localhost:7791';

describe('User create/ logIn / logOut / getProfile / Device, Account (CRUD) ,', function () {

    var agent = request.agent(url);
    var serviceCollection;

    before(function (done) {
        console.log('>>> before');

        var preparingDb = new PreparingBd();

        async.series([
                preparingDb.dropCollection(CONST.MODELS.USER + 's'),
                preparingDb.dropCollection(CONST.MODELS.SERVICE + 's'),
                preparingDb.dropCollection(CONST.MODELS.HISTORY + 's'),
                preparingDb.dropCollection(CONST.MODELS.USER_HISTORY + 's'),
                preparingDb.createServiceByTemplate(SERVICES.SERVICE_GOLD_BANCOMAT_FOR_UPDATE),
                preparingDb.createServiceByTemplate(SERVICES.SERVICE_CAPALABA_RITEILS),
                preparingDb.createServiceByTemplate(SERVICES.SERVICE_SPEDTEST_INET),
                preparingDb.toFillUsers(1),
                preparingDb.createUsersByTemplate(USERS.CLIENT)
            ],
            function (err, results) {
                if (err) {
                    return done(err)
                }
                done();
            });
    });

    it('Unauthorized GET serviceList', function (done) {

        agent
            .post('/user/signOut')
            .send({})
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .get('/service/')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        serviceCollection = res.body;
                        console.dir(res.body);
                        done()
                    });
            });
    });

    it('SEND Good feedback', function (done) {

        var service = serviceCollection[1];
        var loginData = USERS.CLIENT;
        var feedback = {
            serviceId: service._id,
            rate: 3,
            feedback: 'awesome, max rate'
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
                    .post('/feedback')
                    .send(feedback)
                    .expect(201)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        console.dir(res.body);
                        done();
                    });
            });
    });

    it('SEND Bad feedback', function (done) {

        var service = serviceCollection[2];
        var loginData = USERS.CLIENT;
        var feedback = {
            serviceId: service._id,
            rate: 1,
            feedback: 'the worst one'
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
                    .post('/feedback')
                    .send(feedback)
                    .expect(201)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        console.dir(res.body);
                        done();
                    });
            });
    });

    it('GET ALL feedback by Admin', function (done) {

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
                    .get('/feedback')
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

    it('GET ALL feedback by NOT Admin', function (done) {

        var loginData = USERS.CLIENT;

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .get('/feedback')
                    .expect(403)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        console.dir(res.body);
                        done();
                    });
            });
    });

});