'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var CONST = require('../../constants/index');
var USERS = require('./../testHelpers/usersTemplates');
var async = require ('async');
var PreparingBd = require('./preparingDb');

var app = require('../../app');

describe('User Codi Services', function () {
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

    it('Get Codi lessons', function (done) {

        var loginData = {
            username: USERS.CLIENT_CODI_DATA.username,
            password: USERS.CLIENT_CODI_DATA.password
        };

        agent
            .post('/codi/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .get('/codi/lesson')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }

                        done();
                    });
            });
    });

    it('Enroll Codi lesson', function (done) {

        var loginData = {
            username: USERS.CLIENT_CODI_DATA.username,
            password: USERS.CLIENT_CODI_DATA.password
        };

        agent
            .post('/codi/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/codi/lesson')
                    .send({
                        lesson: 'lesson_id'
                    })
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

    it('Get App Checking Status', function (done) {

        var loginData = {
            username: USERS.CLIENT_CODI_DATA.username,
            password: USERS.CLIENT_CODI_DATA.password
        };

        agent
            .post('/codi/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .get('/codi/appStatus')
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

    it('Get App Checking Report', function (done) {

        var loginData = {
            username: USERS.CLIENT_CODI_DATA.username,
            password: USERS.CLIENT_CODI_DATA.password
        };

        agent
            .post('/tda/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .get('/codi/appReport')
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