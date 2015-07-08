'use strict';

var request = require('supertest');
var mongoose = require('mongoose');
var CONST = require('../../constants/index');
var SERVICES = require('./../testHelpers/servicesTemplates');
var USERS = require('./../testHelpers/usersTemplates');
var async =  require('async');
var PreparingBd = require('./preparingDb');
var url = 'http://localhost:7791';

describe('Service create(POST) /  GET / PUT  / (CRUD) ,', function () {

    var agent = request.agent(url);
    var serviceId;

    before(function (done) {
        console.log('>>> before');

        var preparingDb = new PreparingBd();

        async.series([
            preparingDb.dropCollection(CONST.MODELS.USER + 's'),
            //preparingDb.dropCollection(CONST.MODELS.SERVICE + 's'),
            preparingDb.toFillUsers(3),
            preparingDb.createUsersByTemplate(USERS.CLIENT),
            preparingDb.createUsersByTemplate(USERS.GOVERNMENT),
            preparingDb.createUsersByTemplate(USERS.COMPANY)
        ], function (err,results)   {
            if (err) {
                return done(err)
            }
            done();
        });
    });

    it('Admin Create Service', function (done) {

        var loginData = USERS.ADMIN_DEFAULT;
        var data = SERVICES.SERVICE_SPEDTEST_INET;

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/adminService/')
                    .send(data)
                    .expect(201)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        serviceId = res.body._id;
                        console.log(serviceId);
                        done();
                    });
            });
    });

    it('Admin GET Service by  _id', function (done) {

        agent
            .get('/adminService/' + serviceId)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                console.log('Service was get:');
                console.dir(res.body);
                done();
            });
    });

    it('Admin PUT Service by service _id', function (done) {

        var data = SERVICES.SERVICE_GOLD_BANCOMAT;
        var dataForUpdate = SERVICES.SERVICE_GOLD_BANCOMAT_FOR_UPDATE;

        agent
            .post('/adminService/')
            .send(data)
            .expect(201)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                serviceId = res.body._id;
                console.log(serviceId);

                agent
                    .put('/adminService/' + serviceId)
                    .send(dataForUpdate)
                    .expect(202)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        console.dir(res.body);
                        done();
                    });
            });
    });
    it('Admin Create 20 Services', function (done) {

        var createLayoutArray = [];
        var dataObj ={};

        for (var i = 20; i > 0; i--) {
            dataObj[i] =(JSON.parse(JSON.stringify(SERVICES.SERVICE_OIL)));
            dataObj[i].baseUrl = 'http://www.oil' + i + '.net/';
            dataObj[i].serviceProvider = 'Oil retail' + i;
            dataObj[i].serviceProvider = 'OIL INVESTMENT' + i;

            //createLayoutArray.push(saveLayout( dataObj[i]));
            createLayoutArray.push(saveLayout({
                serviceProvider: 'Oil retail' + i,
                serviceName: 'OIL INVESTMENT' + i,
                baseUrl: 'http://www.oil' + i + '.net/',
                serviceType: 'Payment',
                forUserType: [CONST.USER_TYPE.CLIENT, CONST.USER_TYPE.COMPANY, CONST.USER_TYPE.GOVERNMENT],
                method: 'POST',
                url: '/oil',
                params: [{onClick: ''}]
            }));
        }

        async.parallel(createLayoutArray, function (err,results)   {
            if (err) {
                return done(err)
            }
            done();
        });
    });

    function saveLayout(data) {
        return function (callback) {
            agent
                .post('/adminService/')
                .send(data)
                .expect(201)
                .end(function (err, res) {
                    if (err) {
                        return  callback(err)
                    }
                    callback();
                });
        }
    }

    it('Admin Delete Service by _id', function (done) {

        var data = SERVICES.SERVICE_GOLD_BANCOMAT;

        agent
            .post('/adminService/')
            .send(data)
            .expect(201)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                serviceId = res.body._id;
                console.log('id fo deleting: ',serviceId);

                agent
                    .delete('/adminService/' + serviceId)
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


    it('Admin GET ALL Services with Query', function (done) {

        agent
            .get('/adminService/?orderBy=createAt&order=1&page=1&count=20')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                console.log('All Services was get:');
                console.dir(res.body);
                done();
            });
    });

    it('Admin GET Count of Services', function (done) {

        agent
            .get('/adminService/getCount')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                console.log('Count of Services was get:');
                console.dir(res.body);
                done();
            });
    });
});

