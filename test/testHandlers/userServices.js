'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var async = require('async');
var CONST = require('../../constants/index');
var USERS = require('./../testHelpers/usersTemplates');
var SERVICES = require('./../testHelpers/servicesTemplates');
var USER_AGENT = require('./../testHelpers/userAgentTemplates');
var PreparingBd = require('./preparingDb');

var app = require('../../app');

describe('Service User: GET options, POST send request', function () {

    var serviceCollection;
    var agent = request.agent(app);

    before(function (done) {
        this.timeout(30000);

        console.log('>>> before');

        var preparingDb = new PreparingBd();

        async.series([
            preparingDb.dropCollection(CONST.MODELS.USER + 's'),
            preparingDb.toFillUsers(2),
            preparingDb.createServiceByTemplate(SERVICES.DYNAMIC_DOMAIN_WHOIS),
            preparingDb.createServiceByTemplate(SERVICES.DYNAMIC_COMPLAIN_TRA),
            preparingDb.createServiceByTemplate(SERVICES.DYNAMIC_DOMAIN_WHOIS_TEST),
            preparingDb.createUsersByTemplate(USERS.CLIENT)

        ], function (err, results) {
            if (err) {
                return done(err)
            }
            done();
        });
    });

    it('Unauthorized GET ServiceList', function (done) {

        agent
            .post('/crm/signOut')
            .set(USER_AGENT.ANDROID_DEVICE)
            .send({})
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .get('/service')
                    .set(USER_AGENT.ANDROID_DEVICE)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }

                        console.dir(res.body);
                        expect(res.body).to.be.instanceof(Array);
                        expect(res.body).to.have.length.above(0);
                        expect(res.body[0]).to.have.deep.property('serviceName.EN');
                        expect(res.body[0]).to.have.deep.property('serviceName.AR');
                        expect(res.body[0]).to.have.property('icon');
                        expect(res.body[0]).to.have.property('needAuth');

                        serviceCollection = res.body;
                        done()

                    });
            });
    });

    it('Unauthorized GET Service Info', function (done) {

        var data = serviceCollection[1];

        agent
            .get('/service/' + data._id)
            .set(USER_AGENT.ANDROID_DEVICE)
            .send()
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                done()
            });
    });

    it('Unauthorized POST DYNAMIC_DOMAIN_WHOIS', function (done) {

        var data = serviceCollection[0];
        var userRequestBody = {
            'checkUrl': 'google.ae'
        };

        agent
            .post('/service/' + data._id)
            .set(USER_AGENT.ANDROID_DEVICE)
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

    it('Unauthorized POST DYNAMIC_DOMAIN_WHOIS without required field', function (done) {

        var data = serviceCollection[0];

        agent
            .get('/service/' + data._id)
            .set(USER_AGENT.ANDROID_DEVICE)
            .send()
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/service/' + data._id)
                    .set(USER_AGENT.ANDROID_DEVICE)
                    .send({})
                    .expect(400)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        done()
                    });
            });
    });

    it('Unauthorized POST DYNAMIC_COMPLAIN_TRA', function (done) {

        var serviceData = serviceCollection[1];

        var methodData = {
            title: 'TRA services has pretty developers teem',
            description: 'TRA services has pretty developers teem. Its design, its fast work are great result of developers work'
        };

        agent
            .post('/crm/signOut')
            .set(USER_AGENT.ANDROID_DEVICE)
            .send({})
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/service/' + serviceData._id)
                    .set(USER_AGENT.ANDROID_DEVICE)
                    .send(methodData)
                    .expect(401)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }

                        done();
                    });
            });
    });

    it('Authorized POST DYNAMIC_COMPLAIN_TRA', function (done) {

        var serviceData = serviceCollection[1];
        var methodData = {
            title: 'TRA services has pretty developers teem',
            description: 'TRA services has pretty developers teem. Its design, its fast work are great result of developers work'
        };
        var loginData = USERS.CLIENT_REGISTER_DATA;

        agent
            .post('/crm/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/service/' + serviceData._id)
                    .send(methodData)
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