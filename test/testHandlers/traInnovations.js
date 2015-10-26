'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var CONST = require('../../constants/index');
var USERS = require('./../testHelpers/usersTemplates');
var async = require ('async');
var PreparingBd = require('./preparingDb');
var url = 'http://localhost:80';

var app = require('../../app');

describe('User Innovations', function () {
    this.timeout(10000);

    var agent = request.agent(app);
    var preparingDb = new PreparingBd();

    before(function (done) {
        this.timeout(30000);
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

    it('User Create Innovation', function (done) {

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
                    .post('/innovation')
                    .send({
                        title: 'test',
                        message: 'some message',
                        type: 1
                    })
                    .expect(201)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }

                        console.dir(res.body);

                        done();
                    });
            });
    });

    it('User Create BAD Innovation', function (done) {

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
                    .post('/innovation')
                    .send({
                        title: 'test',
                        message: 'some message',
                        type: 66
                    })
                    .expect(400)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }

                        done();
                    });
            });
    });

    it('User Get Innovations', function (done) {

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
                    .get('/innovation')
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

    it('User Get Innovations', function (done) {

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
                    .get('/innovation?offset=0&limit=5')
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

});