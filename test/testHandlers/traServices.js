'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var CONST = require('../../constants/index');
var async =  require('async');
var url = 'http://localhost:7791';

describe('TRA Services tests', function () {
    this.timeout(30000);

    var agent = request.agent(url);

    before(function (done) {
        console.log('>>> before');

        done();
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

    //it('WHOIS GET Data for NOT Exist url', function (done) {
    //
    //    var notExistUrl = 'aedanew.ae';
    //
    //    agent
    //        .get('/checkWhois?checkUrl=' + notExistUrl)
    //        .expect(200)
    //        .end(function (err, res) {
    //            if (err) {
    //                return done(err)
    //            }
    //            console.dir(res.body);
    //            expect(res.body).to.have.property('urlData');
    //            done();
    //        });
    //});
    //
    //it('WHOIS CHECK AVAILABILITY for Available url', function (done) {
    //
    //    var availableUrl = 'aedanew.ae';
    //
    //    agent
    //        .get('/checkWhoisAvailable?checkUrl=' + availableUrl)
    //        .expect(200)
    //        .end(function (err, res) {
    //            if (err) {
    //                return done(err)
    //            }
    //            console.dir(res.body);
    //            expect(res.body).to.have.property('availableStatus');
    //            expect(res.body.availableStatus).equal('Available');
    //            done();
    //        });
    //});
    //
    //it('WHOIS CHECK AVAILABILITY for NOT Available url', function (done) {
    //
    //    var notAvailableUrl = 'mybank.ae';
    //
    //    agent
    //        .get('/checkWhoisAvailable?checkUrl=' + notAvailableUrl)
    //        .expect(200)
    //        .end(function (err, res) {
    //            if (err) {
    //                return done(err)
    //            }
    //            console.dir(res.body);
    //            expect(res.body).to.have.property('availableStatus');
    //            expect(res.body.availableStatus).equal('Not Available');
    //            done();
    //        });
    //});

    //it('SEARCH IMEI real', function (done) {
    //
    //    var imeiCode = '01385100'; //013851002659853
    //
    //    agent
    //        .get('/checkMobile?imei=' + imeiCode)
    //        .expect(200)
    //        .end(function (err, res) {
    //            if (err) {
    //                return done(err)
    //            }
    //            console.dir(res.body);
    //            expect(res.body).to.have.property('devices');
    //            done();
    //        });
    //});
    //
    //it('SEARCH IMEI fake', function (done) {
    //
    //    var imeiCode = '98998'; //013851002659853
    //
    //    agent
    //        .get('/searchMobile?imei=' + imeiCode)
    //        .expect(200)
    //        .end(function (err, res) {
    //            if (err) {
    //                return done(err)
    //            }
    //            console.dir(res.body);
    //            expect(res.body).to.have.property('devices');
    //            expect(res.body.devices).equal([]);
    //            done();
    //        });
    //});
    //
    //it('SEARCH BRAND', function (done) {
    //
    //    var brandName = 'Appl%';
    //
    //    agent
    //        .get('/searchMobileBrand?brand=' + brandName)
    //        .expect(200)
    //        .end(function (err, res) {
    //            if (err) {
    //                return done(err)
    //            }
    //            console.dir(res.body);
    //            expect(res.body).to.have.property('devices');
    //            done();
    //        });
    //});

});