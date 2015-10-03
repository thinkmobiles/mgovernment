'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var CONST = require('../../constants/index');
var USERS = require('./../testHelpers/usersTemplates');
var SERVICES = require('./../testHelpers/servicesTemplates');
var async = require ('async');
var PreparingBd = require('./preparingDb');
var url = 'http://localhost:80';

var app = require('../../app');

describe('User CRM change Profile, change Pass, forgot Pass', function () {
    this.timeout(10000);

    var agent = request.agent(app);
    var preparingDb = new PreparingBd();

    before(function (done) {
        this.timeout(50000);
        console.log('>>> before');

        async.series([
            preparingDb.dropCollection(CONST.MODELS.USER + 's'),
            preparingDb.toFillUsers(1)
        ], function (err, results) {
            if (err) {
                return done(err)
            }
            done();
        });
    });

    it('CRM User Get Profile', function (done) {
        this.timeout(20000);

        var loginData = {
            login: USERS.CLIENT_REGISTER_DATA.login,
            pass: USERS.CLIENT_REGISTER_DATA.pass
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
                    .get('/crm/profile')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }

                        console.dir(res.body);
                        expect(res.body).to.have.property('first');
                        expect(res.body).to.have.property('last');

                        done();
                    });
            });
    });

    it('CRM User Set Profile', function (done) {
        this.timeout(20000);

        var loginData = {
            login: USERS.CLIENT_REGISTER_DATA.login,
            pass: USERS.CLIENT_REGISTER_DATA.pass
        };

        var changeProfileData = {
            first: USERS.CLIENT_REGISTER_DATA.first + 'SomeTest',
            last: USERS.CLIENT_REGISTER_DATA.last + 'SomeTest'
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
                    .put('/crm/profile')
                    .send(changeProfileData)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }

                        done();
                    });
            });
    });

    it('CRM User Change Pass', function (done) {
        this.timeout(20000);

        var loginData = {
            login: USERS.CLIENT_REGISTER_DATA.login,
            pass: USERS.CLIENT_REGISTER_DATA.pass
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
                    .put('/crm/changePass')
                    .send({
                        oldPass: USERS.CLIENT_REGISTER_DATA.pass,
                        newPass: USERS.CLIENT_REGISTER_DATA.pass + 'newPass'
                    })
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }

                        done();
                    });
            });
    });

    it('CRM User login with old Pass', function (done) {
        this.timeout(20000);

        var loginData = {
            login: USERS.CLIENT_REGISTER_DATA.login,
            pass: USERS.CLIENT_REGISTER_DATA.pass
        };

        agent
            .post('/crm/signIn')
            .send(loginData)
            .expect(401)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                done();
            });
    });

    it('CRM User Change Pass to Old', function (done) {
        this.timeout(20000);

        var loginData = {
            login: USERS.CLIENT_REGISTER_DATA.login,
            pass: USERS.CLIENT_REGISTER_DATA.pass + 'newPass'
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
                    .put('/crm/changePass')
                    .send({
                        oldPass: USERS.CLIENT_REGISTER_DATA.pass + 'newPass',
                        newPass: USERS.CLIENT_REGISTER_DATA.pass
                    })
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