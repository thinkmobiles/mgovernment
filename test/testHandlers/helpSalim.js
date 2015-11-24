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

describe('Help Salim test', function () {
    this.timeout(10000);

    var agent = request.agent(app);
    var deleteHelpSalimId;

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

    it('SEND Help Salim UnAuthorized', function (done) {

        var loginData = USERS.CLIENT;

        var data = {
            url: 'http://google.com',
            description: 'Some problem.'
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
                    .post('/sendHelpSalim')
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

    it('Get all Help Salim by Admin', function (done) {

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
                    .get('/cms/helpSalim?page=1&count=10')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }

                        expect(res.body).instanceOf(Array);
                        expect(res.body).not.empty;

                        deleteHelpSalimId = res.body[0]._id;

                        done();
                    });
            });
    });

    it('Get SEARCHED Help Salim by Admin', function (done) {

        var loginData = USERS.ADMIN_DEFAULT;
        var searchTerm = 'google';

        agent
            .post('/user/adminSignIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .get('/cms/helpSalim?page=1&count=10&searchTerm='+searchTerm)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }

                        expect(res.body).instanceOf(Array);
                        expect(res.body).not.empty;

                        done();
                    });
            });
    });

    it('Get Count of Help Salim by Admin', function (done) {

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
                    .get('/cms/helpSalim/getCount')
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

    it('Delete Help Salim by Admin', function (done) {

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
                    .delete('/cms/helpSalim/' + deleteHelpSalimId)
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
