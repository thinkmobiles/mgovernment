'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var CONST = require('../../constants/index');
var USERS = require('./../testHelpers/usersTemplates');
var SERVICES = require('./../testHelpers/servicesTemplates');
var async =  require('async');
var PreparingDB = require('./preparingDB');
var url = 'http://localhost:7791';

describe('TRA Services tests Complains SMSSpam_HelpSalim_PoorCoverage', function () {
    this.timeout(35000);

    var agent = request.agent(url);
    var serviceCollection;

    before(function (done) {
        console.log('>>> before');

        var preparingDb = new PreparingDB();

        async.series([
                preparingDb.dropCollection(CONST.MODELS.USER + 's'),
                preparingDb.dropCollection(CONST.MODELS.FEEDBACK + 's'),
                preparingDb.dropCollection(CONST.MODELS.SERVICE + 's'),
                preparingDb.dropCollection(CONST.MODELS.EMAIL_REPORT + 's'),
                preparingDb.toFillUsers(1),
                preparingDb.createUsersByTemplate(USERS.CLIENT),
                preparingDb.createUsersByTemplate(USERS.COMPANY)
            ],
            function (err, results) {
                if (err) {
                    return done(err)
                }
                //console.log('BD preparing completed')
                done();
            });
    });

    //it('Unauthorized GET serviceList', function (done) {
    //    console.log('GET serviceList: ');
    //    agent
    //        .post('/user/signOut')
    //        .send({})
    //        .expect(200)
    //        .end(function (err, res) {
    //            if (err) {
    //                return done(err)
    //            }
    //
    //            agent
    //                .get('/service/')
    //                .expect(200)
    //                .end(function (err, res) {
    //                    if (err) {
    //                        return done(err)
    //                    }
    //                    serviceCollection = res.body;
    //                    console.log('serviceCollection :',res.body);
    //                    done()
    //                });
    //        });
    //});

    it('SEND data to ComplainSmsBlock', function (done) {

        var loginData = USERS.CLIENT;
        var data = {
            phone: '505050440',
            phoneProvider: '2020',
            providerType: 'du',
            description: 'I receive 10 sms from  number 505050440. Please block him'
        };

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/complainSmsBlock')
                    .send(data)
                    .expect(200)
                    .end(function (err, res) {
                        console.dir(res.body);
                        if (err) {
                            return done(err)
                        }
                        done();
                    });
            });
    });

    it('SEND data to ComplainSmsBlock with BAD values', function (done) {

        var loginData = USERS.CLIENT;
        var data = {
            phone: 505050440,
            phoneProvider: '2020',
            providerType: 'Elesat'
        };

        agent
            .post('/complainSmsBlock')
            .send(data)
            .expect(400)
            .end(function (err, res) {
                console.dir(res.body);
                if (err) {
                    return done(err)
                }
                done();
            });

    });

    it('SEND data to ComplainSmsBlock UnAuthorized', function (done) {

        var loginData = USERS.CLIENT;
        var data = {
            phone: '0995248763',
            phoneProvider: '3030',
            providerType: 'du',
            description: 'I receive 1000 sms from phone number 0995248763. Please stop this'
        };

        agent
            .post('/user/signOut')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/complainSmsBlock')
                    .send(data)
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

    it('SEND data to Help Salim', function (done) {

        var loginData = USERS.CLIENT;
        var data = {
            url: 'http://blabla.com.ae',
            description: 'On this site, I saw illegal content. Please pay attention to the site, check it and possibly block.'
        };

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/sendHelpSalim')
                    .send(data)
                    .expect(200)
                    .end(function (err, res) {
                        console.dir(res.body);
                        if (err) {
                            return done(err)
                        }
                        done();
                    });
            });
    });

    it('SEND data to Help Salim with BAD values', function (done) {

        var data = {
            url: 'blabla.',
            description: 1221212
        };

        agent
            .post('/sendHelpSalim')
            .send(data)
            .expect(400)
            .end(function (err, res) {
                console.dir(res.body);
                if (err) {
                    return done(err)
                }
                done();
            });
    });

    it('SEND data to Help Salim UnAuthorized', function (done) {

        var loginData = USERS.CLIENT;
        var data = {
            url: 'programs.com.ae',
            description: 'Hi. on this site, I saw illegal content. Please pay attention to the site, check it and possibly block.'
        };

        agent
            .post('/user/signOut')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/sendHelpSalim')
                    .send(data)
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

    it('SEND Poor Coverage ', function (done) {

        var loginData = USERS.CLIENT;
        var data = {
            location: {
                latitude: '24.9821547',
                longitude: '55.402868'
            },
            signalLevel: 4
        };

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/sendPoorCoverage')
                    .send(data)
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

    it('SEND Poor Coverage  with BAD values', function (done) {

        var data = {
            location: {
                latitude: '24.9821547'

            },
            signalLevel: 8
        };

        agent
            .post('/sendPoorCoverage')
            .send(data)
            .expect(400)
            .end(function (err, res) {
                console.dir(res.body);
                if (err) {
                    return done(err)
                }
                done();
            });
    });


    it('SEND Poor Coverage UnAuthorized', function (done) {

        var loginData = USERS.CLIENT;
        var data = {
            address: 'New York main street'
        };

        agent
            .post('/user/signOut')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/sendPoorCoverage')
                    .send(data)
                    .expect(200)
                    .end(function (err, res) {
                        console.dir(res.body);
                        if (err) {
                            return done(err)
                        }

                        done();
                    });
            });
    });

});