'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var CONST = require('../../constants/index');
var USERS = require('./../testHelpers/usersTemplates');
var SERVICES = require('./../testHelpers/servicesTemplates');
var async =  require('async');
var PreparingDB = require('./preparingDB');
var url = 'http://localhost:7791';


describe('Test language, when user mobile get service', function () {
    this.timeout(55000);

    var agent = request.agent(url);
    var lastService;


    before(function (done) {
        console.log('>>> before');

        var preparingDb = new PreparingDB();

        async.series([
                preparingDb.dropCollection(CONST.MODELS.USER + 's'),
                //preparingDb.dropCollection(CONST.MODELS.SERVICES_ICON + 's'),
                preparingDb.toFillUsers(1),
                preparingDb.createUsersByTemplate(USERS.CLIENT),
                preparingDb.createServiceByTemplate(SERVICES.SERVICE_HOTEL)
            ],
            function (err, results) {
                if (err) {
                    return done(err)
                }
                console.log('BD preparing completed');

                done();
            });
    });

    it('Get last service direct from Database', function (done) {
        var preparingDb = new PreparingDB();
        preparingDb.getServicesByQueryAndSort({}, {'createdAt': '-1'}, function(err, models)
        {
            if (err) {
                return done(err)
            }
            lastService = models[0]
            console.log(lastService);
            done();
        });

    });


    it('Get service info via mobile Unauthorized', function (done) {

        agent
            .get('/service/info/' + lastService._id)
            .expect(200)
            .end(function (err, res) {
                //console.dir(res.body);
                if (err) {
                    return done(err)
                }

                if (res.body.serviceName === lastService.serviceName.EN) {
                    console.log(res.body.serviceName ,' === ',lastService.serviceName.EN);
                    done();
                } else  done('Get bad language ');
            });
    });

    it('Get service info Unauthorized WITH query lang=AR', function (done) {

        agent
            .get('/service/info/' + lastService._id + '/?lang=AR')
            .expect(200)
            .end(function (err, res) {
                //console.dir(res.body);
                if (err) {
                    return done(err)
                }

                if (res.body.serviceDescription === lastService.serviceDescription.AR) {
                    console.log(res.body.serviceDescription ,' === ',lastService.serviceDescription.AR);
                    done();
                } else  done('Get bad language', res.body.serviceDescription);
            });
    });

    it('Get service info Unauthorized (language must bee saved in session)', function (done) {

        agent
            .get('/service/info/' + lastService._id )
            .expect(200)
            .end(function (err, res) {
                //console.dir(res.body);
                if (err) {
                    return done(err)
                }

                if (res.body.serviceDescription === lastService.serviceDescription.AR) {
                    console.log(res.body.serviceDescription ,' === ',lastService.serviceDescription.AR);
                    done();
                } else  done('Get bad language', res.body.serviceDescription);
            });
    });



    it('Get service info Authorized', function (done) {
        var loginData = USERS.ADMIN_DEFAULT;

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                //console.dir(res.body);
                if (err) {
                    return done(err)
                }
                agent
                    .get('/service/info/' + lastService._id )
                    .expect(200)
                    .end(function (err, res) {
                        //console.dir(res.body);
                        if (err) {
                            return done(err)
                        }

                        if (res.body.serviceDescription === lastService.serviceDescription.AR) {
                            console.log(res.body.serviceDescription ,' === ',lastService.serviceDescription.AR);
                            done();
                        } else  done('Get bad language', res.body.serviceDescription);
                    });
            });
    });



});