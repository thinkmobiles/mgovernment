'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var CONST = require('../../constants/index');
var USERS = require('./../testHelpers/usersTemplates');
var SERVICES = require('./../testHelpers/servicesTemplates');
var USER_AGENT = require('./../testHelpers/userAgentTemplates');
var async = require ('async');
var PreparingBd = require('./preparingDB');

var app = require('../../app');

describe('Static Services Info test', function () {
    this.timeout(10000);

    var agent = request.agent(app);
    var serviceId;

    before(function (done) {
        this.timeout(40000);
        console.log('>>> before');

        var preparingDb = new PreparingBd();

        async.series([
                preparingDb.dropCollection(CONST.MODELS.USER + 's'),
                preparingDb.toFillUsers(1)
            ],
            function (err, results) {
                if (err) {
                    return done(err)
                }
                done();
            });
    });


    it('Get all Static Services Info by Admin', function (done) {

        var loginData = USERS.ADMIN_DEFAULT;

        agent
            .post('/user/adminSignIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .get('/cms/staticServicesInfo')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }

                        expect(res.body).to.instanceof(Array);
                        expect(res.body).not.to.empty;
                        expect(res.body[0]).to.have.deep.property('profile');
                        expect(res.body[0].profile).to.have.deep.property('Service Package');

                        serviceId = res.body[0]._id;

                        done();
                    });
            });
    });

    it('Admin Get Static Services Info by Id', function (done) {

        var loginData = USERS.ADMIN_DEFAULT;

        agent
            .post('/user/adminSignIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .get('/cms/staticServicesInfo/' + serviceId)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }

                        expect(res.body).to.instanceof(Object);
                        expect(res.body).not.to.empty;
                        expect(res.body).to.have.deep.property('profile');
                        expect(res.body.profile).to.have.deep.property('Service Package');

                        console.log(res.body);

                        done();
                    });
            });
    });

    it('Admin Update Static Services Info by Id', function (done) {

        var loginData = USERS.ADMIN_DEFAULT;
        var editField = 'Some test';
        var serviceData;

        agent
            .post('/user/adminSignIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .get('/cms/staticServicesInfo/' + serviceId)
                    .expect(200)
                    .end(function (err, res){
                        if (err) {
                            return done(err);
                        }

                         serviceData = {
                            serviceName: res.body.serviceName,
                            profile: {
                                'Name': {
                                    EN: res.body.profile['Name'].EN,
                                    AR: res.body.profile['Name'].AR
                                },
                                'About the service': {
                                    EN: editField,
                                    AR: res.body.profile['About the service'].AR
                                },
                                'Service Package': {
                                    EN: res.body.profile['Service Package'].EN,
                                    AR: res.body.profile['Service Package'].AR
                                },
                                'Expected time': {
                                    EN: res.body.profile['Expected time'].EN,
                                    AR: res.body.profile['Expected time'].AR
                                },
                                'Officer in charge of this service': {
                                    EN: res.body.profile['Officer in charge of this service'].EN,
                                    AR: res.body.profile['Officer in charge of this service'].AR
                                },
                                'Required documents': {
                                    EN: res.body.profile['Required documents'].EN,
                                    AR: res.body.profile['Required documents'].AR
                                },
                                'Service fee': {
                                    EN: res.body.profile['Service fee'].EN,
                                    AR: res.body.profile['Service fee'].AR
                                },
                                'Terms and conditions': {
                                    EN: res.body.profile['Terms and conditions'].EN,
                                    AR: res.body.profile['Terms and conditions'].AR
                                }
                            }
                        };

                    agent
                        .put('/cms/staticServicesInfo/' + serviceId)
                        .send(serviceData)
                        .expect(200)
                        .end(function (err, res) {
                            if (err) {
                                return done(err);
                            }

                            expect(res.body).to.instanceof(Object);
                            expect(res.body).not.to.empty;
                            expect(res.body).to.have.deep.property('success');
                            expect(res.body.success).to.equal('Success');

                            agent
                                .get('/cms/staticServicesInfo/' + serviceId)
                                .expect(200)
                                .end(function (err, res) {
                                    if (err) {
                                        return done(err)
                                    }

                                    console.log(res.body.profile);
                                    expect(res.body).to.instanceof(Object);
                                    expect(res.body).not.to.empty;
                                    expect(res.body.profile).to.have.deep.property('About the service');
                                    expect(res.body.profile['About the service'].EN).to.equal(editField);

                                    done();
                                });
                        });
                    });
            });
    });

});