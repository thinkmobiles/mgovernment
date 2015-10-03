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