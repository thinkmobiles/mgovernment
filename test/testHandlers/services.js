'use strict';

var request = require('supertest');
var mongoose = require('mongoose');
var CONST = require('../../constants/index');
var SERVICES = require('./../testHelpers/servicesTemplates');
var USERS = require('./../testHelpers/usersTemplates');
var async =  require('async');
var PreparingBd = require('./preparingDb');

var app = require('../../app');

describe('Service CRUD by admin,', function () {

    var agent = request.agent(app);
    var serviceId;

    before(function (done) {
        this.timeout(30000);
        console.log('>>> before');

        var preparingDb = new PreparingBd();

        async.series([
            preparingDb.dropCollection(CONST.MODELS.USER + 's'),
            preparingDb.dropCollection(CONST.MODELS.SERVICE + 's'),
            preparingDb.toFillUsers(1),
            preparingDb.createUsersByTemplate(USERS.CLIENT)
        ], function (err,results)   {
            if (err) {
                return done(err)
            }
            done();
        });
    });

    it('Admin Create Service', function (done) {

        var loginData = USERS.ADMIN_DEFAULT;
        var data = SERVICES.DYNAMIC_COMPLAIN_TRA;

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/cms/adminService/')
                    .send(data)
                    .expect(201)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        serviceId = res.body._id;
                        console.log(serviceId);

                        done();
                    });
            });
    });

    it('Admin GET Service by  _id', function (done) {

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
                    .get('/cms/adminService/' + serviceId)
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

    it('Admin PUT Service by service _id', function (done) {

        var data = SERVICES.DYNAMIC_DOMAIN_WHOIS;
        var dataForUpdate = SERVICES.DYNAMIC_DOMAIN_WHOIS_TEST;

        agent
            .post('/cms/adminService/')
            .send(data)
            .expect(201)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                serviceId = res.body._id;
                console.log(serviceId);

                agent
                    .put('/cms/adminService/' + serviceId)
                    .send(dataForUpdate)
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

    it('Admin Delete Service by _id', function (done) {

        var data = SERVICES.DYNAMIC_DOMAIN_WHOIS;

        agent
            .post('/cms/adminService/')
            .send(data)
            .expect(201)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                serviceId = res.body._id;
                console.log('id for delete: ', serviceId);

                agent
                    .delete('/cms/adminService/' + serviceId)
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


    it('Admin GET ALL Services with Query', function (done) {

        agent
            .get('/cms/adminService/?orderBy=createAt&order=1&page=1&count=20')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                console.log('GET ALL Services with Query:');
                console.dir(res.body);
                done();
            });
    });

    it('Admin GET Count of Services', function (done) {

        agent
            .get('/cms/adminService/getCount')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                console.log('GET Count of Services:');
                console.dir(res.body);

                done();
            });
    });
});

