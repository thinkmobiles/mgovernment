'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var CONST = require('../../constants/index');
var USERS = require('./../testHelpers/usersTemplates');
var SERVICES = require('./../testHelpers/servicesTemplates');
var async =  require('async');
var PreparingDB = require('./preparingDB');
var url = 'http://localhost:80';

describe('TRA Services tests', function () {
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
                preparingDb.createUsersByTemplate(USERS.COMPANY),
                preparingDb.createServiceByTemplate(SERVICES.SERVICE_GOLD_BANCOMAT_FOR_UPDATE),
                preparingDb.createServiceByTemplate(SERVICES.SERVICE_CAPALABA_RITEILS),
                preparingDb.createServiceByTemplate(SERVICES.SERVICE_SPEDTEST_INET)
            ],
            function (err, results) {
                if (err) {
                    return done(err)
                }
                done();
            });
    });

/*
    it('WHOIS GET Data for Exist url', function (done) {

        var existUrl = 'google.ae';

        agent
            .get('/checkWhois?checkUrl=' + existUrl)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                console.dir(res.body);
                expect(res.body).to.have.property('urlData');
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
                expect(res.body).to.have.property('urlData');
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
                console.dir(res.body);
                expect(res.body).to.have.property('availableStatus');
                expect(res.body.availableStatus).equal('Not Available');
                done();
            });
    });

    it('SEARCH IMEI real', function (done) {

        var imeiCode = '01385100'; //013851002659853

        agent
            .get('/searchMobile?imei=' + imeiCode)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                console.dir(res.body);
                expect(res.body).to.have.property('devices');
                done();
            });
    });

    it('SEARCH IMEI fake', function (done) {

        var imeiCode = '98998'; //013851002659853

        agent
            .get('/searchMobile?imei=' + imeiCode)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                console.dir(res.body);
                expect(res.body).to.have.property('devices');
                expect(res.body.devices).equal([]);
                done();
            });
    });

    it('SEARCH BRAND', function (done) {

        var brandName = 'Appl%';

        agent
            .get('/searchMobileBrand?brand=' + brandName)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                console.dir(res.body);
                expect(res.body).to.have.property('devices');
                done();
            });
    });
*/

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
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        serviceCollection = res.body;
                        console.log('serviceCollection :',res.body);
                        done()
                    });
            });
    });

    it('SEND data to ComplainSmsSpam', function (done) {

        var service = serviceCollection[1];
        var loginData = USERS.CLIENT;
        var data = {
            phone: '7893',
            phoneProvider: '2020',
            providerType: 'elesat',
            description: 'I receive 10 sms from number 505050440'
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
                    .post('/complainSmsSpam')
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

    it('SEND data to ComplainSmsSpam UnAuthorized', function (done) {

        var service = serviceCollection[1];
        var loginData = USERS.CLIENT;
        var data = {
            phone: '0995248763',
            phoneProvider: '3030',
            providerType: 'du',
            description: 'I receive 1000 sms from phone number 0995248763'
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
                    .post('/complainSmsSpam')
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

        var service = serviceCollection[1];
        var loginData = USERS.CLIENT;
        var data = {
            url: 'blabla.com.ae',
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
                        if (err) {
                            return done(err)
                        }
                        console.dir(res.body);
                        done();
                    });
            });
    });

    it('SEND data to Help Salim UnAuthorized', function (done) {

        var service = serviceCollection[1];
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

    it('SEND complainServiceProvider', function (done) {

               var loginData = USERS.CLIENT;
        var data = {
            title: 'It works slowly',
            serviceProvider: 'amazon',
            description: 'Amazon is awefull',
            referenceNumber: '12312412'
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
                    .post('/complainServiceProvider')
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

    it('SEND complainServiceProvider UnAuthorized', function (done) {

        var loginData = USERS.CLIENT;
        var data = {
            title: 'It works good, but i dont like img in header.',
            serviceProvider: 'Facebook',
            description: 'It works good, but i dont like img in header. Can they change this img to another? Thanks',
            referenceNumber: '12312412'
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
                    .post('/complainServiceProvider')
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

    it('SEND complainTRAService', function (done) {

        var loginData = USERS.CLIENT;
        var data = {
            title: 'I like TRA services',
            description: 'TRA has very cool services. I think TRA is Best of the bests of the bests... :) e.t.c.'
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
                    .post('/complainTRAService')
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

    it('SEND complainTRAService UnAuthorized', function (done) {

        var loginData = USERS.CLIENT;
        var data = {
            title: 'TRA services has pretty developers teem',
            description: 'TRA services has pretty developers teem. Its design, its fast work are greate result of developers work'
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
                    .post('/complainTRAService')
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

    it('GET CRM CASES', function (done) {

        agent
            .get('/crm/case')
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