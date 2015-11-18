'use strict';

var request = require('supertest');
var mongoose = require('mongoose');
var expect = require('chai').expect;
var CONST = require('../../constants/index');
var SERVICES = require('./../testHelpers/servicesTemplates');
var USERS = require('./../testHelpers/usersTemplates');
var async =  require('async');
var PreparingBd = require('./preparingDb');

var app = require('../../app');

describe('Service CRUD by admin,', function () {

    var agent = request.agent(app);
    var serviceId;
    var serviceNotHomeScreen;
    var serviceNotEnable;
    var serviceHubId;

    before(function (done) {
        this.timeout(30000);
        console.log('>>> before');

        var preparingDb = new PreparingBd();

        async.series([
            preparingDb.dropCollection(CONST.MODELS.USER + 's'),
            preparingDb.dropCollection(CONST.MODELS.SERVICE + 's'),
            preparingDb.toFillUsers(1),
            preparingDb.createUsersByTemplate(USERS.CLIENT)
        ], function (err,results)   {
            if (err) {
                return done(err)
            }
            done();
        });
    });

    it('Admin Create Service', function (done) {

        var loginData = USERS.ADMIN_DEFAULT;
        var data = SERVICES.DYNAMIC_COMPLAIN_TRA;

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/cms/adminService/')
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

    it('Admin Create Service { homeScreen = false }', function (done) {

        var loginData = USERS.ADMIN_DEFAULT;
        var data = SERVICES.DYNAMIC_COMPLAIN_TRA;
        data.homeScreen = false;

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/cms/adminService/')
                    .send(data)
                    .expect(201)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        serviceNotHomeScreen = res.body._id;
                        console.log(serviceNotHomeScreen);

                        done();
                    });
            });
    });

    it('Admin Create Service { enable = false }', function (done) {

        var loginData = USERS.ADMIN_DEFAULT;
        var data = SERVICES.DYNAMIC_COMPLAIN_TRA;
        data.enable = false;

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/cms/adminService/')
                    .send(data)
                    .expect(201)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        serviceNotEnable = res.body._id;
                        console.log(serviceNotEnable);

                        done();
                    });
            });
    });

    it('Admin GET Service by  _id', function (done) {

        var loginData = USERS.ADMIN_DEFAULT;

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .get('/cms/adminService/' + serviceId)
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

    it('Admin PUT Service by service _id', function (done) {

        var data = SERVICES.DYNAMIC_DOMAIN_WHOIS;
        var dataForUpdate = SERVICES.DYNAMIC_DOMAIN_WHOIS_TEST;

        agent
            .post('/cms/adminService/')
            .send(data)
            .expect(201)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                serviceId = res.body._id;
                console.log(serviceId);

                agent
                    .put('/cms/adminService/' + serviceId)
                    .send(dataForUpdate)
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

    it('Admin Delete Service by _id', function (done) {

        var data = SERVICES.DYNAMIC_DOMAIN_WHOIS;

        agent
            .post('/cms/adminService/')
            .send(data)
            .expect(201)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                serviceId = res.body._id;
                console.log('id for delete: ', serviceId);

                agent
                    .delete('/cms/adminService/' + serviceId)
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
            .get('/cms/adminService/?orderBy=createAt&order=1&page=1&count=20')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                console.log('GET ALL Services with Query:');
                console.dir(res.body);
                done();
            });
    });

    it('Admin GET Count of Services', function (done) {

        agent
            .get('/cms/adminService/getCount')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                console.log('GET Count of Services:');
                console.dir(res.body);

                done();
            });
    });

    it('Admin Create Service HUB', function (done) {

        var loginData = USERS.ADMIN_DEFAULT;
        var serviceHubData = SERVICES.DYNAMIC_SERVICE_HUB_TEST;

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .get('/cms/adminService')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        console.log('GET ALL Services with Query:');
                        console.dir(res.body);

                        expect(res.body).to.be.instanceof(Array);
                        expect(res.body).to.have.length.above(0);

                        for (var i in res.body) {
                            serviceHubData.items.push(res.body[i]._id);
                        }

                        agent
                            .post('/cms/adminService/hub')
                            .send(serviceHubData)
                            .expect(201)
                            .end(function (err, res) {
                                if (err) {
                                    return done(err)
                                }
                                serviceHubId = res.body._id;
                                console.log(serviceHubId);

                                done();
                            });
                    });
            });
    });


    it('User GET Service List with HUB', function (done) {

        agent
            .post('/user/signOut')
            .send({})
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .get('/service')
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

                        for(var i in res.body) {

                            expect(res.body[i]._id).not.equal(serviceNotHomeScreen);
                            expect(res.body[i]._id).not.equal(serviceNotEnable);

                            if (res.body[i]._id === serviceHubId) {
                                expect(res.body[i]).to.have.property('items');
                                for (var j in res.body[i].items) {
                                    var serviceHubItems = res.body[i].items;
                                    expect(serviceHubItems).to.be.instanceof(Array);
                                    expect(serviceHubItems).to.have.length.above(0);
                                    expect(serviceHubItems[j]._id).not.equal(serviceNotEnable);
                                    expect(serviceHubItems[0]).to.have.deep.property('serviceName.EN');
                                    expect(serviceHubItems[0]).to.have.deep.property('serviceName.AR');
                                    expect(serviceHubItems[0]).to.have.property('icon');
                                    expect(serviceHubItems[0]).to.have.property('needAuth');
                                }
                                return done();
                                }
                            }

                        done('Not found Service Hub');
                    });
            });
    });

});

