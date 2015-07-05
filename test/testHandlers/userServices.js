'use strict';

var request = require('supertest');
var mongoose = require('mongoose');
var async = require('async');

var CONST = require('../../constants/index');
var USERS = require('./../testHelpers/usersTemplates');
var SERVICES = require('./../testHelpers/servicesTemplates');
var PreparingBd = require('./preparingDb');

var url = 'http://localhost:7791';

describe('Service User: GET options, POST send request', function () {

    var serviceCollection;
    var agent = request.agent(url);

    before(function (done) {
        console.log('>>> before');

        var preparingDb = new PreparingBd();

        async.series([
            preparingDb.dropCollection(CONST.MODELS.USER + 's'),
            preparingDb.dropCollection(CONST.MODELS.SERVICE + 's'),
            preparingDb.toFillUsers(done,3),
            preparingDb.createServiceByTemplate(SERVICES.SERVICE_GOLD_BANCOMAT_FOR_UPDATE),
            preparingDb.createServiceByTemplate(SERVICES.SERVICE_GOLD_BANCOMAT_FOR_UPDATE,[CONST.USER_TYPE.GUEST, CONST.USER_TYPE.CLIENT, CONST.USER_TYPE.COMPANY, CONST.USER_TYPE.GOVERNMENT]),
            preparingDb.createServiceByTemplate(SERVICES.SERVICE_GOLD_BANCOMAT_FOR_UPDATE,[CONST.USER_TYPE.CLIENT, CONST.USER_TYPE.COMPANY, CONST.USER_TYPE.GOVERNMENT]),
            preparingDb.createServiceByTemplate(SERVICES.SERVICE_GOLD_BANCOMAT_FOR_UPDATE,[CONST.USER_TYPE.COMPANY, CONST.USER_TYPE.GOVERNMENT]),
            preparingDb.createServiceByTemplate(SERVICES.SERVICE_GOLD_BANCOMAT_FOR_UPDATE,[CONST.USER_TYPE.GOVERNMENT]),


            preparingDb.createUsersByTemplate(USERS.CLIENT,3),
            preparingDb.createUsersByTemplate(USERS.GOVERNMENT,2),
            preparingDb.createUsersByTemplate(USERS.COMPANY,3),


        ], function (err,results)   {
            if (err) {
                return done(err)
            }
            done();
        });
    });

    //it('Admin Create Service For ALL', function (done) {
    //
    //    var loginData = USERS.ADMIN_DEFAULT;
    //    var data = SERVICES.SERVICE_SPEDTEST_INET;
    //
    //    agent
    //        .post('/user/signIn')
    //        .send(loginData)
    //        .expect(200)
    //        .end(function (err, res) {
    //            if (err) {
    //                return done(err)
    //            }
    //
    //            agent
    //                .post('/adminService/')
    //                .send(data)
    //                .expect(201)
    //                .end(function (err, res) {
    //                    if (err) {
    //                        return done(err)
    //                    }
    //                    console.log(res.body._id);
    //                    done();
    //                });
    //        });
    //});
    //
    //it('Admin Create Service For Client', function (done) {
    //
    //    var loginData = USERS.ADMIN_DEFAULT;
    //    var data = SERVICES.SERVICE_SPEDTEST_INET;
    //
    //    data.serviceName = data.serviceName + 'Client';
    //    data.forUserType = [CONST.USER_TYPE.CLIENT, CONST.USER_TYPE.ADMIN];
    //
    //    agent
    //        .post('/user/signIn')
    //        .send(loginData)
    //        .expect(200)
    //        .end(function (err, res) {
    //            if (err) {
    //                return done(err)
    //            }
    //
    //            agent
    //                .post('/adminService/')
    //                .send(data)
    //                .expect(201)
    //                .end(function (err, res) {
    //                    if (err) {
    //                        return done(err)
    //                    }
    //                    console.log(res.body._id);
    //                    done();
    //                });
    //        });
    //});
    //
    //it('Admin Create Service For Company', function (done) {
    //
    //    var loginData = USERS.ADMIN_DEFAULT;
    //    var data = SERVICES.SERVICE_SPEDTEST_INET;
    //
    //    data.serviceName = data.serviceName + 'Company';
    //    data.forUserType = [CONST.USER_TYPE.COMPANY, CONST.USER_TYPE.ADMIN];
    //
    //    agent
    //        .post('/user/signIn')
    //        .send(loginData)
    //        .expect(200)
    //        .end(function (err, res) {
    //            if (err) {
    //                return done(err)
    //            }
    //
    //            agent
    //                .post('/adminService/')
    //                .send(data)
    //                .expect(201)
    //                .end(function (err, res) {
    //                    if (err) {
    //                        return done(err)
    //                    }
    //                    console.log(res.body._id);
    //                    done();
    //                });
    //        });
    //});
    //
    //it('Admin Create Service For Government', function (done) {
    //
    //    var loginData = USERS.ADMIN_DEFAULT;
    //    var data = SERVICES.SERVICE_SPEDTEST_INET;
    //
    //    data.serviceName = data.serviceName + 'Government';
    //    data.forUserType = [CONST.USER_TYPE.GOVERNMENT, CONST.USER_TYPE.ADMIN];
    //
    //    agent
    //        .post('/user/signIn')
    //        .send(loginData)
    //        .expect(200)
    //        .end(function (err, res) {
    //            if (err) {
    //                return done(err)
    //            }
    //
    //            agent
    //                .post('/service/')
    //                .send(data)
    //                .expect(201)
    //                .end(function (err, res) {
    //                    if (err) {
    //                        return done(err)
    //                    }
    //                    console.log(res.body._id);
    //                    done();
    //                });
    //        });
    //});

    it('Unauthorized GET serviceList', function (done) {

        agent
            .post('/user/signOut')
            .send({})
            .expect(200)
            .end(function (err, res) {

                if (err) {
                    return done(err)
                }

                agent
                    .get('/service/')
                    .send({})
                    .expect(200)
                    .end(function (err, res) {

                        if (err) {
                            return done(err)
                        }
                        serviceCollection = res.body;
                        console.dir(res.body);
                        done()

                    });
            });
    });

    it('Unauthorized GET and POST ALLOWED service', function (done) {

        var data = serviceCollection[0];

        agent
            .get('/service/' + data._id)
            .send()
            .expect(200)
            .end(function (err, res) {

                if (err) {
                    return done(err)
                }
                //console.dir(res.body);

                agent
                    .post('/service/' + data._id)
                    .send()
                    .expect(200)
                    .end(function (err, res) {

                        if (err) {
                            return done(err)
                        }
                        //console.dir(res.body);
                        done()
                    });
            });
    });

    it('Unauthorized GET and POST FORBIDDEN service', function (done) {

        var data = serviceCollection[3];

        agent
            .get('/service/' + data._id)
            .send()
            .expect(200)
            .end(function (err, res) {

                if (err) {
                    return done(err)
                }
                //console.dir(res.body);

                agent
                    .post('/service/' + data._id)
                    .send()
                    .expect(403)
                    .end(function (err, res) {

                        if (err) {
                            return done(err)
                        }
                        //console.dir(res.body);
                        done()
                    });
            });
    });

    it('Authorized GET and POST ALLOWED service', function (done) {

        var data = serviceCollection[3];

        agent
            .get('/service/' + data._id)
            .send()
            .expect(200)
            .end(function (err, res) {

                if (err) {
                    return done(err)
                }
                //console.dir(res.body);

                agent
                    .post('/service/' + data._id)
                    .send()
                    .expect(403)
                    .end(function (err, res) {

                        if (err) {
                            return done(err)
                        }
                        //console.dir(res.body);
                        done()
                    });
            });
    });
});