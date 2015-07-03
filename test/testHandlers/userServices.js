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

    var userId;
    var agent = request.agent(url);

    before(function (done) {
      console.log('>>> before');

        var preparingDb = new PreparingBd();

        preparingDb.dropCollection(CONST.MODELS.USER + 's');
            preparingDb.toFillUsers(done,3);

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