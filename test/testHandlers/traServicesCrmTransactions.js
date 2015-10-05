'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var CONST = require('../../constants/index');
var USERS = require('./../testHelpers/usersTemplates');
var async =  require('async');
var PreparingDB = require('./preparingDB');

var app = require('../../app');

describe('TRA CRM Services tests SMSSpam', function () {
    this.timeout(30000);

    var agent = request.agent(app);
    var serviceCollection;

    before(function (done) {
        console.log('>>> before');

        var preparingDb = new PreparingDB();

        async.series([
                preparingDb.dropCollection(CONST.MODELS.USER + 's'),
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

    it('Get Transactions', function (done) {

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
                    .get('/crm/transactions')
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

    it('Get Transactions Page 2 Count 5 ASC', function (done) {

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
                    .get('/crm/transactions?page=2&count=5&orderAsc=1')
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

    it('Get Transactions Page 1 Count 5', function (done) {

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
                    .get('/crm/transactions?page=1&count=5')
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

    /*it('SEND Suggestion AND Get Transactions', function (done) {

        var loginData = USERS.CLIENT_CRM_LOGIN_DIGI;
        var data = {
            title: 'Hi there. I want to',
            description: 'I want to in TRA service...'
        };

        agent
            .post('/crm/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/sendSuggestion')
                    .send(data)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        console.dir(res.body);

                        agent
                            .get('/crm/transactions')
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
    });*/

});