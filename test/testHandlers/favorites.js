'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var CONST = require('../../constants/index');
var USERS = require('./../testHelpers/usersTemplates');
var IMAGES = require('./../testHelpers/imageTemplates');
var SERVICES = require('./../testHelpers/servicesTemplates');
var async = require ('async');
var PreparingBd = require('./preparingDb');
var url = 'http://localhost:7791';

describe('User create/ logIn / logOut / getProfile / Device, Account (CRUD) ,', function () {

    var agent = request.agent(url);
    var userId;
    var serviceCollection;

    before(function (done) {
        console.log('>>> before');

        var preparingDb = new PreparingBd();

        async.series([
            preparingDb.dropCollection(CONST.MODELS.USER + 's'),
            preparingDb.dropCollection(CONST.MODELS.SERVICE + 's'),
            //preparingDb.dropCollection(CONST.MODELS.HISTORY + 's'),
            //preparingDb.dropCollection(CONST.MODELS.USER_HISTORY + 's'),
            preparingDb.createServiceByTemplate(SERVICES.SERVICE_GET_DOMAIN_DATA_TMA_TRA_SERVICES),
            preparingDb.createServiceByTemplate(SERVICES.SERVICE_CHECK_DOMAIN_AVAILABILITY_TMA_TRA_SERVICES),
            preparingDb.createServiceByTemplate(SERVICES.SERVICE_SEARCH_DEVCIE_BY_IMEI_TMA_TRA_SERVICES),
            preparingDb.createServiceByTemplate(SERVICES.SERVICE_SEARCH_DEVICE_BY_BRANDNAME_TMA_TRA_SERVICES),
            preparingDb.createServiceByTemplate(SERVICES.SERVICE_SMS_SPAM_TMA_TRA_SERVICES),
            preparingDb.createServiceByTemplate(SERVICES.SERVICE_SMS_BLOCK_TMA_TRA_SERVICES),
            preparingDb.createServiceByTemplate(SERVICES.SERVICE_HELP_SALIM_TMA_TRA_SERVICES),
            preparingDb.createServiceByTemplate(SERVICES.SERVICE_RATING_TMA_TRA_SERVICES),
            preparingDb.createServiceByTemplate(SERVICES.SERVICE_COMPLAIN_SUGGESTION_TRA_SERVICES),
            preparingDb.createServiceByTemplate(SERVICES.SERVICE_COMPLAIN_ENQUIRIES_TRA_SERVICES),
            preparingDb.createServiceByTemplate(SERVICES.SERVICE_COMPLAIN_SERVICE_PROVIDER_TMA_TRA_SERVICES),
            preparingDb.createServiceByTemplate(SERVICES.SERVICE_COMPLAIN_TRA_SERVICES),
            preparingDb.createServiceByTemplate(SERVICES.SERVICE_COMPLAIN_POOR_COVERAGE_TRA_SERVICES),

            preparingDb.toFillUsers(1)
        ], function (err,results)   {
            if (err) {
                return done(err)
            }
            done();
        });
    });

    it('Create user', function (done) {

        var loginData = USERS.ADMIN_DEFAULT;
        var data = USERS.CLIENT_GOOD_USER_TYPE;

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/user/')
                    .send(data)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        expect(res.body).to.have.property('login');
                        expect(res.body).to.have.property('pass');
                        expect(res.body).to.have.property('userType');
                        expect(res.body.login).to.equal('client123');
                        done();
                    });
            });
    });

    it('Login with GOOD credentials (client123, pass1234)', function (done) {

        var loginData = USERS.CLIENT_GOOD_USER_TYPE;

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                done();
            });
    });


    it('User GET serviceList', function (done) {

        agent
            .get('/service/')
            .send({})
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                serviceCollection = res.body;
                //console.dir(res.body);
                done()

            });

    });

    it('User GET serviceNames', function (done) {

        agent
            .get('/service/serviceNames')
            .send({})
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                //serviceCollection = res.body;
                console.log(res.body);
                done()

            });

    });



    it('ADD services to Favorites', function (done) {

        var serviceNames = [];

        serviceNames.push(serviceCollection[0].serviceName);
        serviceNames.push(serviceCollection[1].serviceName);
        serviceNames.push(serviceCollection[2].serviceName);
        serviceNames.push(serviceCollection[5].serviceName);

        agent
            .post('/user/favorites/')
            .send({serviceNames: serviceNames} )
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                done();
            });

    });

    it('ADD Duplicate services to Favorites', function (done) {

        var serviceNames = [];
        serviceNames.push(serviceCollection[0].serviceName);
        serviceNames.push(serviceCollection[5].serviceName);
        serviceNames.push(serviceCollection[10].serviceName);

        agent
            .post('/user/favorites/')
            .send({serviceNames: serviceNames} )
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                done();
            });

    });

    it('Get Favorites Services', function (done) {

        agent
            .get('/user/favorites/')
            .send()
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                console.dir(res.body);
                done();
            });
    });

    it('Delete service from Favorites', function (done) {

        var serviceNames = [];

        serviceNames.push(serviceCollection[0].serviceName);

        agent
            .delete('/user/favorites/')
            .send({serviceNames: serviceNames})
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                done();
            });

    });

    it('Get  Favorites Services', function (done) {

         agent
            .get('/user/favorites/')
            .send()
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