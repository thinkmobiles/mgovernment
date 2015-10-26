'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var CONST = require('../../constants/index');
var USERS = require('./../testHelpers/usersTemplates');
var SERVICES = require('./../testHelpers/servicesTemplates');
var async = require ('async');
var PreparingBd = require('./preparingDB');
var url = 'http://localhost:80';

describe('Feedback tests - Create, Get ,', function () {
    this.timeout(10000);

    var agent = request.agent(url);
    var serviceCollection;

    before(function (done) {
        this.timeout(40000);
        console.log('>>> before');

        var preparingDb = new PreparingBd();

        async.series([
                preparingDb.dropCollection(CONST.MODELS.USER + 's'),
                //preparingDb.dropCollection(CONST.MODELS.FEEDBACK + 's'),
                //preparingDb.dropCollection(CONST.MODELS.SERVICE + 's'),
                preparingDb.toFillUsers(1),
                preparingDb.createUsersByTemplate(USERS.CLIENT),
                preparingDb.createUsersByTemplate(USERS.COMPANY),
                preparingDb.createServiceByTemplate(SERVICES.SERVICE_CAPALABA_RITEILS)
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
            .post('/crm/signOut')
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

    //it('SEND Good feedback', function (done) {
    //
    //    var service = serviceCollection[0];
    //    var loginData = USERS.CLIENT_CRM_LOGIN_DIGI;
    //    var feedback = {
    //        serviceName: service.serviceName,
    //        serviceId: service._id,
    //        rate: 3,
    //        feedback: 'awesome, max rate'
    //    };
    //
    //    agent
    //        .post('/crm/signIn')
    //        .send(loginData)
    //        .expect(200)
    //        .end(function (err, res) {
    //            if (err) {
    //                return done(err)
    //            }
    //
    //            agent
    //                .post('/feedback')
    //                .send(feedback)
    //                .expect(201)
    //                .end(function (err, res) {
    //                    console.dir(res.body);
    //                    if (err) {
    //                        return done(err)
    //                    }
    //                    done();
    //                });
    //        });
    //});
    //
    //it('SEND  feedback with BAD values', function (done) {
    //
    //    var service = serviceCollection[0];
    //    var loginData = USERS.CLIENT_CRM_LOGIN_DIGI;
    //    var feedback = {
    //        serviceName: service.serviceName,
    //        rate: 5,
    //        feedback: 'the worst one'
    //    };
    //
    //    agent
    //        .post('/crm/signIn')
    //        .send(loginData)
    //        .expect(200)
    //        .end(function (err, res) {
    //            if (err) {
    //                return done(err)
    //            }
    //
    //            agent
    //                .post('/feedback')
    //                .send(feedback)
    //                .expect(201)
    //                .end(function (err, res) {
    //                    console.dir(res.body);
    //                    if (err) {
    //                        return done(err)
    //                    }
    //                    done();
    //                });
    //        });
    //});

    it('SEND GOOD feedback UnAuthorized', function (done) {

        var service = serviceCollection[0];
        var loginData = USERS.CLIENT_CRM_LOGIN_DIGI;
        var feedback = {
            serviceName: service.serviceName,
            serviceId: service._id,
            rate: 4,
            feedback: 'pretty nice'
        };

        agent
            .post('/crm/signOut')
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
                        console.dir(res.body);
                        if (err) {
                            return done(err)
                        }
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

        var loginData = USERS.CLIENT_CRM_LOGIN_DIGI;

        agent
            .post('/crm/signIn')
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