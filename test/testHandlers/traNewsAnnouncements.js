'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var CONST = require('../../constants/index');
var USERS = require('./../testHelpers/usersTemplates');
var USER_AGENT = require('./../testHelpers/userAgentTemplates');
var async = require ('async');
var PreparingBd = require('./preparingDb');

var app = require('../../app');

describe('User Announcements', function () {
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

    it('User Get News', function (done) {
        this.timeout(20000);

        agent
            .get('/announcement')
            .set(USER_AGENT.ANDROID_DEVICE)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                console.dir(res.body);
                expect(res.body).to.have.property('announcements');
                expect(res.body.announcements).to.be.instanceof(Array);

                expect(res.body.announcements).to.have.length.least(1);
                for (var i = 0; res.body.announcements.length > i ; i++){
                    expect(res.body.announcements).to.have.deep.property(i + '.title');
                    expect(res.body.announcements).to.have.deep.property(i + '.description');
                    expect(res.body.announcements).to.have.deep.property(i + '.link');
                    expect(res.body.announcements).to.have.deep.property(i + '.pubDate');
                    expect(res.body.announcements).to.have.deep.property(i + '.image');
                }

                done();
            });
    });

    it('User Get News offset=5 limit=10', function (done) {
        this.timeout(20000);

        agent
            .get('/announcement?offset=5&limit=10')
            .set(USER_AGENT.IPAD_DEVICE)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                console.dir(res.body);
                expect(res.body).to.have.property('announcements');
                expect(res.body.announcements).to.be.instanceof(Array);
                expect(res.body.announcements).to.have.length.above(0);
                expect(res.body.announcements).to.have.length.of.at.most(10);

                done();
            });
    });

    it('User Get News search=security offset=0 limit=10', function (done) {
        this.timeout(20000);

        agent
            .get('/announcement?offset=0&limit=10&search=season')
            .set(USER_AGENT.IPAD_DEVICE)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                console.dir(res.body);
                expect(res.body).to.have.property('announcements');
                expect(res.body.announcements).to.be.instanceof(Array);
                expect(res.body.announcements).to.have.length.above(0);

                expect(res.body.announcements).to.have.length.of.at.most(10);
                for (var i = 0; res.body.announcements.length > i ; i++){
                    expect(res.body.announcements[i]).to.satisfy(function(data){
                        var indexTitle = data.title.toLowerCase().indexOf('season');
                        var indexDescription = data.description.toLowerCase().indexOf('season');
                        return (indexTitle > -1 || indexDescription > -1)
                    });
                }

                done();
            });
    });

    it('User Get News search=qwertylkjfh offset=0 limit=10', function (done) {
        this.timeout(20000);

        agent
            .get('/announcement?offset=0&limit=10&search=qwertylkjfh')
            .set(USER_AGENT.IPAD_DEVICE)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                console.dir(res.body);
                expect(res.body).to.have.property('announcements');
                expect(res.body.announcements).to.be.instanceof(Array);
                expect(res.body.announcements).to.be.empty;

                done();
            });
    });

});