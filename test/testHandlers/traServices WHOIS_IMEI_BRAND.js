'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var CONST = require('../../constants/index');
var USERS = require('./../testHelpers/usersTemplates');
var SERVICES = require('./../testHelpers/servicesTemplates');
var async =  require('async');
var PreparingDB = require('./preparingDB');
var url = 'http://localhost:7791';

describe('TRA Services tests  WHOIS, IMEI, BRAND', function () {
    this.timeout(35000);

    var agent = request.agent(url);
    var serviceCollection;

    before(function (done) {
        console.log('>>> before');

        var preparingDb = new PreparingDB();

        async.series([
                preparingDb.dropCollection(CONST.MODELS.USER + 's'),
                preparingDb.dropCollection(CONST.MODELS.FEEDBACK + 's'),
                preparingDb.dropCollection(CONST.MODELS.SERVICE + 's'),
                preparingDb.dropCollection(CONST.MODELS.EMAIL_REPORT + 's'),
                preparingDb.toFillUsers(1),
                preparingDb.createUsersByTemplate(USERS.CLIENT),
                preparingDb.createUsersByTemplate(USERS.COMPANY),
                preparingDb.createServiceByTemplate(SERVICES.SERVICE_GOLD_BANCOMAT_FOR_UPDATE),
                preparingDb.createServiceByTemplate(SERVICES.SERVICE_CAPALABA_RITEILS),
                preparingDb.createServiceByTemplate(SERVICES.SERVICE_SPEDTEST_INET)
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

        var imeiCode = '01385100'; //013851002659853

        agent
            .get('/searchMobile?imei=' + imeiCode)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                console.dir(res.body);
                expect(res.body).to.have.property('devices');
                done();
            });
    });

    it('SEARCH IMEI fake', function (done) {

        var imeiCode = '98998'; //013851002659853

        agent
            .get('/searchMobile?imei=' + imeiCode)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                console.dir(res.body);
                expect(res.body).to.have.property('devices');
                expect(res.body.devices).equal([]);
                done();
            });
    });

    it('SEARCH BRAND', function (done) {

        var brandName = 'Appl%';

        agent
            .get('/searchMobileBrand?brand=' + brandName)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                console.dir(res.body);
                expect(res.body).to.have.property('devices');
                done();
            });
    });
});