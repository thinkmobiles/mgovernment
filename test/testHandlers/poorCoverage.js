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

describe('Poor Coverage test', function () {
    this.timeout(10000);

    var agent = request.agent(app);
    var deletePoorCoverageId;

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

    it('SEND Poor Coverage UnAuthorized', function (done) {

        var loginData = USERS.CLIENT;

        var data = {
            address: 'Some location',
            location: {
                latitude: 24.9821547,
                longitude: 55.402868
            },
            signalLevel: 4
        };

        agent
            .post('/user/signOut')
            .set(USER_AGENT.ANDROID_DEVICE)
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/sendPoorCoverage')
                    .set(USER_AGENT.ANDROID_DEVICE)
                    .send(data)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }

                        expect(res.body).to.have.deep.property('success');
                        expect(res.body.success).to.equal('Success');

                        done();
                    });
            });
    });

    it('Get all Poor Coverage by Admin', function (done) {

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
                    .get('/cms/poorCoverage?page=1&count=10')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }

                        expect(res.body).instanceOf(Array);
                        expect(res.body).not.empty;

                        deletePoorCoverageId = res.body[0]._id;

                        done();
                    });
            });
    });

    it('Get Count of Poor Coverage by Admin', function (done) {

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
                    .get('/cms/poorCoverage/getCount')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }

                        expect(res.body).to.have.deep.property('count');
                        expect(res.body.count).to.be.above(0);

                        done();
                    });
            });
    });

    it('Delete Poor Coverage by Admin', function (done) {

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
                    .delete('/cms/poorCoverage/' + deletePoorCoverageId)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }

                        expect(res.body).to.have.deep.property('success');
                        expect(res.body.success).to.equal('Success');

                        done();
                    });
            });
    });

});
