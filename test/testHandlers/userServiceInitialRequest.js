'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var async = require('async');
var CONST = require('../../constants/index');
var USERS = require('./../testHelpers/usersTemplates');
var SERVICES = require('./../testHelpers/servicesTemplates');
var USER_AGENT = require('./../testHelpers/userAgentTemplates');
var PreparingBd = require('./preparingDb');

var app = require('../../app');

describe('Service User Initial Request', function () {

    var serviceCollection;
    var agent = request.agent(app);

    before(function (done) {
        this.timeout(30000);

        console.log('>>> before');

        var preparingDb = new PreparingBd();

        async.series([
            preparingDb.dropCollection(CONST.MODELS.USER + 's'),
            preparingDb.toFillUsers(2),
            preparingDb.createServiceByTemplate(SERVICES.DYNAMIC_SERVICE_INITIAL_REQUEST_TEST),
            preparingDb.createUsersByTemplate(USERS.CLIENT)

        ], function (err, results) {
            if (err) {
                return done(err)
            }
            done();
        });
    });

    it('Unauthorized GET ServiceList', function (done) {

        agent
            .post('/crm/signOut')
            .set(USER_AGENT.ANDROID_DEVICE)
            .send({})
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .get('/service')
                    .set(USER_AGENT.ANDROID_DEVICE)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }

                        console.dir(res.body);
                        expect(res.body).to.be.instanceof(Array);
                        expect(res.body).to.have.length.above(0);
                        expect(res.body[0]).to.have.deep.property('serviceName.EN');
                        expect(res.body[0]).to.have.deep.property('serviceName.AR');
                        expect(res.body[0]).to.have.property('icon');
                        expect(res.body[0]).to.have.property('needAuth');

                        serviceCollection = res.body;
                        done()

                    });
            });
    });

    it('Unauthorized GET DYNAMIC_DOMAIN_WHOIS with Initial Request', function (done) {

        var data = serviceCollection[serviceCollection.length - 1];

        agent
            .get('/service/' + data._id)
            .set(USER_AGENT.ANDROID_DEVICE)
            .send()
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                expect(res.body.dataContent).not.be.empty;

                done();
            });
    });

});