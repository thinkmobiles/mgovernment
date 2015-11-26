'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var CONST = require('../../constants/index');
var USERS = require('./../testHelpers/usersTemplates');
var SERVICES = require('./../testHelpers/servicesTemplates');
var USER_AGENT = require('./../testHelpers/userAgentTemplates');
var async = require ('async');
var PreparingBd = require('./preparingDb');

var app = require('../../app');

describe('Get About Services Info', function () {
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

    it('GET Service About Info', function (done) {
        this.timeout(2000);

        agent
            .get('/service/about?name=Complain about Service Provider')
            .set(USER_AGENT.ANDROID_DEVICE)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                console.dir(res.body);

                done();
            });
    });

    it('GET Service About Info EN', function (done) {
        this.timeout(2000);

        agent
            .get('/service/about?name=Suggestion&lang=EN')
            .set(USER_AGENT.ANDROID_DEVICE)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                console.dir(res.body);

                done();
            });
    });

    it('GET Service About Info AR', function (done) {
        this.timeout(2000);

        agent
            .get('/service/about?name=Complain about Service Provider&lang=AR')
            .set(USER_AGENT.ANDROID_DEVICE)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                console.dir(res.body);

                done();
            });
    });

    it('GET Service Names EN', function (done) {
        this.timeout(2000);

        agent
            .get('/service/serviceNames')
            .set(USER_AGENT.ANDROID_DEVICE)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                console.dir(res.body);

                done();
            });
    });

    it('GET Service Names AR', function (done) {
        this.timeout(2000);

        agent
            .get('/service/serviceNames?lang=AR')
            .set(USER_AGENT.ANDROID_DEVICE)
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