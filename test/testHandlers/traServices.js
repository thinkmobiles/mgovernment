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
            description: 'TRA services has pretty developers teem. Its design, its fast work are greate result of developers work',
            attachment: 'data:image/png;base64,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'
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