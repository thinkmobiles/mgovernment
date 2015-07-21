'use strict';

var request = require('supertest');
var mongoose = require('mongoose');
var async = require('async');

var CONST = require('../../constants/index');
var USERS = require('./../testHelpers/usersTemplates');
var SERVICES = require('./../testHelpers/servicesTemplates');
var PreparingBd = require('./preparingDb');

var url = 'http://localhost:7791';

describe('Service User: GET options, POST send request', function () {

    var serviceCollection;
    var agent = request.agent(url);

    before(function (done) {
        console.log('>>> before');

        var preparingDb = new PreparingBd();

        async.series([
            preparingDb.dropCollection(CONST.MODELS.USER + 's'),
            preparingDb.dropCollection(CONST.MODELS.SERVICE + 's'),
            preparingDb.toFillUsers(3),
            preparingDb.createServiceByTemplate(SERVICES.SERVICE_GOLD_BANCOMAT_FOR_UPDATE),
            preparingDb.createServiceByTemplate(SERVICES.SERVICE_CAPALABA_RITEILS),
            preparingDb.createServiceByTemplate(SERVICES.SERVICE_CAPALABA_COMMUNICATIONS_GET),
            preparingDb.createServiceByTemplate(SERVICES.SERVICE_CAPALABA_COMMUNICATIONS_POST),
            preparingDb.createServiceByTemplate(SERVICES.SERVICE_GOLD_BANCOMAT_FOR_UPDATE,[CONST.USER_TYPE.GUEST, CONST.USER_TYPE.CLIENT, CONST.USER_TYPE.COMPANY, CONST.USER_TYPE.GOVERNMENT]),
            preparingDb.createServiceByTemplate(SERVICES.SERVICE_GOLD_BANCOMAT_FOR_UPDATE,[CONST.USER_TYPE.CLIENT, CONST.USER_TYPE.COMPANY, CONST.USER_TYPE.GOVERNMENT]),
            preparingDb.createServiceByTemplate(SERVICES.SERVICE_GOLD_BANCOMAT_FOR_UPDATE,[CONST.USER_TYPE.COMPANY, CONST.USER_TYPE.GOVERNMENT]),
            preparingDb.createServiceByTemplate(SERVICES.SERVICE_GOLD_BANCOMAT_FOR_UPDATE,[CONST.USER_TYPE.GOVERNMENT]),
            preparingDb.createServiceByTemplate(SERVICES.SERVICE_TMA_TRA_CHECK_MOBILE_VERIFICATION),
            preparingDb.createUsersByTemplate(USERS.CLIENT),
            preparingDb.createUsersByTemplate(USERS.GOVERNMENT),
            preparingDb.createUsersByTemplate(USERS.COMPANY)

        ], function (err,results)   {
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
                    .send({})
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

    it('Unauthorized GET and POST ALLOWED service', function (done) {

        var data = serviceCollection[0];

        agent
            .get('/service/' + data._id)
            .send()
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                done()
            });
    });

    it('Unauthorized POST TRA_CHECK_MOBILE_VERIFICATION', function (done) {

        var data = serviceCollection[8];
        var userRequestBody = {
            'IMEI': '351957053969065'
        };


        agent
            .post('/service/' + data._id)
            .send(userRequestBody)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                console.dir(res.body);
                done()
            });
    });

    it('Unauthorized GET and POST FORBIDDEN service', function (done) {

        var data = serviceCollection[5];

        agent
            .get('/service/' + data._id)
            .send()
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/service/' + data._id)
                    .send()
                    .expect(403)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        done()
                    });
            });
    });

    it('Authorized GET and POST  CAPALABA service (with signIn)', function (done) {

        var data = serviceCollection[1];
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
                    .get('/service/' + data._id)
                    .send()
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }

                        agent
                            .post('/service/' + data._id)
                            .send({text : 'Hello Capalaba' })
                            .expect(200)
                            .end(function (err, res) {
                                if (err) {
                                    return done(err)
                                }
                                done();
                            });
                    });
            });
    });

    it('Authorized Send Request to CAPALABA for get Riteils (using  Users Cookies)', function (done) {

        var data = serviceCollection[1];
        var loginData = USERS.CLIENT;

        agent
            .post('/service/' + data._id)
            .send({text : 'Hello Capalaba' })
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                done();
            });
    });

    it('Authorized Send Request to CAPALABA for GET Communication (using  Users Cookies)', function (done) {

        var data = serviceCollection[2];
        var loginData = USERS.CLIENT;

        agent
            .post('/service/' + data._id)
            .send({text : 'Hello Capalaba' })
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                done();
            });
    });

    it('Authorized Send Request to CAPALABA for POST Communication', function (done) {

        var data = serviceCollection[3];
        var sendData = {
            distance: null,
            end_datetime: "2019-01-02T14:24:46.834Z",
            message: 'WTF ...PILESOS TOLKEN',
            start_datetime: null
        };

        agent
            .post('/service/' + data._id)
            .send(sendData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                done();
            });
    });
});