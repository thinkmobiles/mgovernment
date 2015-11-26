'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var CONST = require('../../constants/index');
var USERS = require('./../testHelpers/usersTemplates');
var SERVICES = require('./../testHelpers/servicesTemplates');
var USER_AGENT = require('./../testHelpers/userAgentTemplates');
var async =  require('async');
var PreparingDB = require('./preparingDB');
var url = 'http://localhost:80';

var app = require('../../app');

describe('TRA Services WHOIS, IMEI, BRAND', function () {
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
                console.log('BD preparing completed');
                done();
            });
    });

    it('WHOIS GET Data for Exist url', function (done) {

        var existUrl = 'google.ae';

        agent
            .get('/checkWhois?checkUrl=' + existUrl)
            .set(USER_AGENT.ANDROID_DEVICE)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                console.dir(res.body);
                expect(res.body).to.have.property('urlData');
                done();
            });
    });

    it('WHOIS GET Data for NOT Exist url', function (done) {

        var notExistUrl = 'aedanew.ae';

        agent
            .get('/checkWhois?checkUrl=' + notExistUrl)
            .set(USER_AGENT.ANDROID_DEVICE)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                console.dir(res.body);
                expect(res.body).to.have.property('urlData');
                done();
            });
    });

    it('WHOIS CHECK AVAILABILITY for Available url', function (done) {

        var availableUrl = 'aedanew.ae';

        agent
            .get('/checkWhoisAvailable?checkUrl=' + availableUrl)
            .set(USER_AGENT.ANDROID_DEVICE)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                console.dir(res.body);
                expect(res.body).to.have.property('availableStatus');
                expect(res.body.availableStatus).equal('Available');
                done();
            });
    });

    it('WHOIS CHECK AVAILABILITY for NOT Available url', function (done) {

        var notAvailableUrl = 'mybank.ae';

        agent
            .get('/checkWhoisAvailable?checkUrl=' + notAvailableUrl)
            .set(USER_AGENT.ANDROID_DEVICE)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                console.dir(res.body);
                expect(res.body).to.have.property('availableStatus');
                expect(res.body.availableStatus).equal('Not Available');
                done();
            });
    });

    it('SEARCH IMEI real', function (done) {

        var imeiCode = '0138 5100 265985 3'; //013851002659853

        agent
            .get('/searchMobile?imei=' + imeiCode)
            .set(USER_AGENT.ANDROID_DEVICE)
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

    it('SEARCH IMEI fake', function (done) {

        var imeiCode = ' 989981 23123 1231'; //013851002659853

        agent
            .get('/searchMobile?imei=' + imeiCode)
            .set(USER_AGENT.ANDROID_DEVICE)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                console.dir(res.body);
                expect(res.body).to.be.instanceof(Array);
                expect(res.body).to.be.empty;
                done();
            });
    });

    it('SEARCH BRAND', function (done) {

        var brandName = 'Appl%';

        agent
            .get('/searchMobileBrand?brand=' + brandName)
            .set(USER_AGENT.ANDROID_DEVICE)
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