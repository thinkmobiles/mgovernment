'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var CONST = require('../../constants/index');
var USERS = require('./../testHelpers/usersTemplates');
var SERVICES = require('./../testHelpers/servicesTemplates');
var async = require ('async');
var PreparingBd = require('./preparingDB');

var app = require('../../app');

describe('Feedback tests - Create, Get ,', function () {
    this.timeout(10000);

    var agent = request.agent(app);
    var serviceCollection;

    var deletedFeedbackId;

    before(function (done) {
        this.timeout(30000);
        console.log('>>> before');

        var preparingDb = new PreparingBd();

        async.series([
                preparingDb.dropCollection(CONST.MODELS.USER + 's'),
                preparingDb.dropCollection(CONST.MODELS.FEEDBACK + 's'),
                preparingDb.toFillUsers(1),
                preparingDb.createUsersByTemplate(USERS.CLIENT),
                preparingDb.createUsersByTemplate(USERS.COMPANY),
                preparingDb.createServiceByTemplate(SERVICES.DYNAMIC_DOMAIN_WHOIS)
            ],
            function (err, results) {
                if (err) {
                    return done(err)
                }
                done();
            });
    });

    it('Unauthorized GET serviceList', function (done) {

        agent
            .post('/crm/signOut')
            .set('appkey', CONST.APPLICATION_KEY_FOR_TOKEN)
            .set('user-agent','Mozilla/5.0 (iPad; CPU OS 5_1_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/9B206')
            .send({})
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .get('/service/')
                    .set('appkey', CONST.APPLICATION_KEY_FOR_TOKEN)
                    .set('user-agent','Mozilla/5.0 (iPad; CPU OS 5_1_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/9B206')
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

    it('SEND Good feedback', function (done) {

        var service = serviceCollection[0];
        var loginData = USERS.CLIENT_CRM_LOGIN_DIGI;
        var feedback = {
            serviceName: service.serviceName,
            serviceId: service._id,
            rate: 3,
            feedback: 'awesome, max rate'
        };

        agent
            .post('/crm/signIn')
            .set('appkey', CONST.APPLICATION_KEY_FOR_TOKEN)
            .set('user-agent','Mozilla/5.0 (iPad; CPU OS 5_1_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/9B206')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/feedback')
                    .set('appkey', CONST.APPLICATION_KEY_FOR_TOKEN)
                    .set('user-agent','Mozilla/5.0 (iPad; CPU OS 5_1_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/9B206')
                    .send(feedback)
                    .expect(201)
                    .end(function (err, res) {
                        console.dir(res.body);
                        if (err) {
                            return done(err)
                        }
                        done();
                    });
            });
    });

    it('SEND  feedback with BAD values', function (done) {

        var service = serviceCollection[0];
        var loginData = USERS.CLIENT_CRM_LOGIN_DIGI;
        var feedback = {
            serviceName: service.serviceName,
            rate: 5,
            feedback: 'the worst one'
        };

        agent
            .post('/crm/signIn')
            .set('appkey', CONST.APPLICATION_KEY_FOR_TOKEN)
            .set('user-agent','Mozilla/5.0 (iPad; CPU OS 5_1_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/9B206')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/feedback')
                    .set('appkey', CONST.APPLICATION_KEY_FOR_TOKEN)
                    .set('user-agent','Mozilla/5.0 (iPad; CPU OS 5_1_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/9B206')
                    .send(feedback)
                    .expect(201)
                    .end(function (err, res) {
                        console.dir(res.body);
                        if (err) {
                            return done(err)
                        }
                        done();
                    });
            });
    });

    it('SEND GOOD feedback UnAuthorized', function (done) {

        var service = serviceCollection[0];
        var loginData = USERS.CLIENT_CRM_LOGIN_DIGI;
        var feedback = {
            //serviceName: service.serviceName,
            serviceId: service._id,
            rate: '3',
            feedback: 'pretty nice'
        };

        agent
            .post('/crm/signOut')
            .set('appkey', CONST.APPLICATION_KEY_FOR_TOKEN)
            .set('user-agent','Mozilla/5.0 (iPad; CPU OS 5_1_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/9B206')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/feedback')
                    .set('appkey', CONST.APPLICATION_KEY_FOR_TOKEN)
                    .set('user-agent','Mozilla/5.0 (iPad; CPU OS 5_1_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/9B206')
                    .send(feedback)
                    .expect(201)
                    .end(function (err, res) {
                        console.dir(res.body);
                        if (err) {
                            return done(err)
                        }
                        done();
                    });
            });
    });

    it('GET ALL feedback by Admin', function (done) {

        var loginData = USERS.ADMIN_DEFAULT;

        agent
            .post('/user/adminSignIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .get('/cms/feedback')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        console.dir(res.body);
                        deletedFeedbackId = res.body[0]._id;

                        done();
                    });
            });
    });

    //it('GET ALL feedback by NOT Admin', function (done) {
    //
    //    var loginData = USERS.CLIENT_CRM_LOGIN_DIGI;
    //
    //    agent
    //        .post('/crm/signIn')
    //        .send(loginData)
    //        .expect(200)
    //        .end(function (err, res) {
    //            if (err) {
    //                return done(err)
    //            }
    //
    //            agent
    //                .get('/feedback')
    //                .expect(403)
    //                .end(function (err, res) {
    //                    if (err) {
    //                        return done(err)
    //                    }
    //                    console.dir(res.body);
    //                    done();
    //                });
    //        });
    //});

    it('GET SEARCHED feedback by Admin', function (done) {

        var loginData = USERS.ADMIN_DEFAULT;

        agent
            .post('/user/adminSignIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .get('/cms/feedback?search=pretty')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        console.dir(res.body);
                        expect(res.body).to.not.empty;
                        for (var i = 0; res.body.length > i; i++){
                            expect(res.body[i]).to.satisfy(function(data){
                                var indexFeedback = data.feedback.toLowerCase().indexOf('pretty');
                                return indexFeedback > -1
                            })
                        }

                        done();
                    });
            });
    });

    it('GET SEARCHED feedback with WRONG key by Admin', function(done){

        var loginData = USERS.ADMIN_DEFAULT;

        agent
            .post('/user/adminSignIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .get('/cms/feedback?search=query1223')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        console.dir(res.body);
                        expect(res.body).to.empty;

                        done();
                    });
            });
    });

    it('DELETED feedback by admin', function (done) {

        var loginData = USERS.ADMIN_DEFAULT;

        agent
            .post('/user/adminSignIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .delete('/cms/feedback/'+deletedFeedbackId)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        agent
                            .get('/cms/feedback?search=pretty')
                            .expect(200)
                            .end(function (err, res) {
                                if (err) {
                                    return done(err);
                                }

                                expect(res.body).to.be.empty;
                                console.log(res.body);

                                done();
                            });
                    });
            });
    });

});