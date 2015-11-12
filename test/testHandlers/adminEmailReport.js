'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var CONST = require('../../constants/index');
var USERS = require('./../testHelpers/usersTemplates');
var SERVICES = require('./../testHelpers/servicesTemplates');
var async = require ('async');
var PreparingBd = require('./preparingDB');

var app = require('../../app');

describe('Admin Email Report tests', function () {
    this.timeout(10000);

    var agent = request.agent(app);

    var deleteEmailReportId;

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
            address: 'New York main street',
            signalLevel: 4
        };

        agent
            .post('/user/signOut')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/sendPoorCoverage')
                    .send(data)
                    .expect(200)
                    .end(function (err, res) {
                        console.dir(res.body);
                        if (err) {
                            return done(err)
                        }

                        done();
                    });
            });
    });

    it('Get ALL Email Report by admin', function (done) {

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
                    .get('/emailReport')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        deleteEmailReportId = res.body[0]._id;
                        console.log(res.body);

                        done();
                    });
            });
    });

    it('Delete Email Report by admin', function (done) {

        var loginData = USERS.ADMIN_DEFAULT;

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                agent
                    .delete('/emailReport/'+deleteEmailReportId)
                    .expect(200)
                    .end(function (err, res) {
                       if (err) {
                           return done(err);
                       }

                        done();
                    });
            });
    });

});