'use strict';

var request = require('supertest');
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

        var existUrl = 'tra.gov.ae';

        agent
            .get('/checkWhois?checkUrl=' + existUrl)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                console.dir(res.body);
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
                expect(res.body).to.have.property('availableStatus');
                expect(res.body.availableStatus).equal('Not Available');
                console.dir(res.body);
                done();
            });
    });

});
