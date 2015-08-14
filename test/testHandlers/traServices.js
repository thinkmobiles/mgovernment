'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var CONST = require('../../constants/index');
var USERS = require('./../testHelpers/usersTemplates');
var SERVICES = require('./../testHelpers/servicesTemplates');
var async =  require('async');
var PreparingDB = require('./preparingDB');
var url = 'http://localhost:7791';

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
                //console.log('BD preparing completed')
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

    //it('Unauthorized GET serviceList', function (done) {
    //    console.log('GET serviceList: ')
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
    //
    //it('SEND data to ComplainSmsSpam', function (done) {
    //
    //    var service = serviceCollection[1];
    //    var loginData = USERS.CLIENT;
    //    var data = {
    //        phone: '7893',
    //        phoneProvider: '2020',
    //        providerType: 'elesat',
    //        description: 'I receive 10 sms from number 505050440'
    //    };
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
    //                .post('/complainSmsSpam')
    //                .send(data)
    //                .expect(200)
    //                .end(function (err, res) {
    //                    if (err) {
    //                        return done(err)
    //                    }
    //                    console.dir(res.body);
    //                    done();
    //                });
    //        });
    //});
    //
    //it('SEND data to ComplainSmsSpam UnAuthorized', function (done) {
    //
    //    var service = serviceCollection[1];
    //    var loginData = USERS.CLIENT;
    //    var data = {
    //        phone: '0995248763',
    //        phoneProvider: '3030',
    //        providerType: 'du',
    //        description: 'I receive 1000 sms from phone number 0995248763'
    //    };
    //
    //    agent
    //        .post('/user/signOut')
    //        .send(loginData)
    //        .expect(200)
    //        .end(function (err, res) {
    //            if (err) {
    //                return done(err)
    //            }
    //
    //            agent
    //                .post('/complainSmsSpam')
    //                .send(data)
    //                .expect(200)
    //                .end(function (err, res) {
    //                    if (err) {
    //                        return done(err)
    //                    }
    //                    console.dir(res.body);
    //                    done();
    //                });
    //        });
    //});
    //
    //it('SEND data to Help Salim', function (done) {
    //
    //    var service = serviceCollection[1];
    //    var loginData = USERS.CLIENT;
    //    var data = {
    //        url: 'blabla.com.ae',
    //        description: 'On this site, I saw illegal content. Please pay attention to the site, check it and possibly block.'
    //    };
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
    //                .post('/sendHelpSalim')
    //                .send(data)
    //                .expect(200)
    //                .end(function (err, res) {
    //                    if (err) {
    //                        return done(err)
    //                    }
    //                    console.dir(res.body);
    //                    done();
    //                });
    //        });
    //});
    //
    //it('SEND data to Help Salim UnAuthorized', function (done) {
    //
    //    var service = serviceCollection[1];
    //    var loginData = USERS.CLIENT;
    //    var data = {
    //        url: 'programs.com.ae',
    //        description: 'Hi. on this site, I saw illegal content. Please pay attention to the site, check it and possibly block.'
    //    };
    //
    //    agent
    //        .post('/user/signOut')
    //        .send(loginData)
    //        .expect(200)
    //        .end(function (err, res) {
    //            if (err) {
    //                return done(err)
    //            }
    //
    //            agent
    //                .post('/sendHelpSalim')
    //                .send(data)
    //                .expect(200)
    //                .end(function (err, res) {
    //                    if (err) {
    //                        return done(err)
    //                    }
    //                    console.dir(res.body);
    //                    done();
    //                });
    //        });
    //});
    //
    //it('SEND complainServiceProvider', function (done) {
    //
    //           var loginData = USERS.CLIENT;
    //    var data = {
    //        title: 'It works slowly',
    //        serviceProvider: 'amazon',
    //        description: 'Amazon is awefull',
    //        referenceNumber: '12312412',
    //        attachment:'data:image/png;base64,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'
    //    };
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
    //                .post('/complainServiceProvider')
    //                .send(data)
    //                .expect(200)
    //                .end(function (err, res) {
    //                    if (err) {
    //                        return done(err)
    //                    }
    //                    console.dir(res.body);
    //                    done();
    //                });
    //        });
    //});
    //
    //it('SEND complainServiceProvider UnAuthorized', function (done) {
    //
    //    var loginData = USERS.CLIENT;
    //    var data = {
    //        title: 'It works good, but i dont like img in header.',
    //        serviceProvider: 'Facebook',
    //        description: 'It works good, but i dont like img in header. Can they change this img to another? Thanks',
    //        referenceNumber: '12312412'
    //    };
    //
    //    agent
    //        .post('/user/signOut')
    //        .send(loginData)
    //        .expect(200)
    //        .end(function (err, res) {
    //            if (err) {
    //                return done(err)
    //            }
    //
    //            agent
    //                .post('/complainServiceProvider')
    //                .send(data)
    //                .expect(200)
    //                .end(function (err, res) {
    //                    if (err) {
    //                        return done(err)
    //                    }
    //                    console.dir(res.body);
    //                    done();
    //                });
    //        });
    //});
    //
    //it('SEND complainTRAService', function (done) {
    //
    //    var loginData = USERS.CLIENT;
    //    var data = {
    //        title: 'I like TRA services',
    //        description: 'TRA has very cool services. I think TRA is Best of the bests of the bests... :) e.t.c.'
    //          };
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
    //                .post('/complainTRAService')
    //                .send(data)
    //                .expect(200)
    //                .end(function (err, res) {
    //                    if (err) {
    //                        return done(err)
    //                    }
    //                    console.dir(res.body);
    //                    done();
    //                });
    //        });
    //});
    //
    //it('SEND complainTRAService UnAuthorized', function (done) {
    //
    //    var loginData = USERS.CLIENT;
    //    var data = {
    //        title: 'TRA services has pretty developers teem',
    //        description: 'TRA services has pretty developers teem. Its design, its fast work are greate result of developers work',
    //        attachment: 'data:image/png;base64,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'
    //    };
    //
    //    agent
    //        .post('/user/signOut')
    //        .send(loginData)
    //        .expect(200)
    //        .end(function (err, res) {
    //            if (err) {
    //                return done(err)
    //            }
    //
    //            agent
    //                .post('/complainTRAService')
    //                .send(data)
    //                .expect(200)
    //                .end(function (err, res) {
    //                    if (err) {
    //                        return done(err)
    //                    }
    //                    console.dir(res.body);
    //                    done();
    //                });
    //        });
    //});
    //
    //
    //it('SEND complainEnquiries', function (done) {
    //
    //    var loginData = USERS.CLIENT;
    //    var data = {
    //        title: 'I dont like such enquiries',
    //        description: 'I dont like such enquiries. Because...'
    //    };
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
    //                .post('/complainEnquiries')
    //                .send(data)
    //                .expect(200)
    //                .end(function (err, res) {
    //                    if (err) {
    //                        return done(err)
    //                    }
    //                    console.dir(res.body);
    //                    done();
    //                });
    //        });
    //});
    //
    //it('SEND complainEnquiries UnAuthorized', function (done) {
    //
    //    var loginData = USERS.CLIENT;
    //    var data = {
    //        title: 'I dont like enquirie _________________',
    //        description: 'I dont like such enquiries. Because...',
    //        attachment: 'data:image/png;base64,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'
    //    };
    //
    //    agent
    //        .post('/user/signOut')
    //        .send(loginData)
    //        .expect(200)
    //        .end(function (err, res) {
    //            if (err) {
    //                return done(err)
    //            }
    //
    //            agent
    //                .post('/complainEnquiries')
    //                .send(data)
    //                .expect(200)
    //                .end(function (err, res) {
    //                    if (err) {
    //                        return done(err)
    //                    }
    //                    console.dir(res.body);
    //                    done();
    //                });
    //        });
    //});
    //
    //// ------------
    //it('SEND Suggestion', function (done) {
    //
    //    var loginData = USERS.CLIENT;
    //    var data = {
    //        title: 'Hi there. I am Ibrahim. I want to _______',
    //        description: 'I there. I am Ibrahim. I want to _______ in TRA servicce.... ',
    //        attachment: 'data:image/png;base64,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'
    //    };
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
    //                .post('/sendSuggestion')
    //                .send(data)
    //                .expect(200)
    //                .end(function (err, res) {
    //                    if (err) {
    //                        return done(err)
    //                    }
    //                    console.dir(res.body);
    //                    done();
    //                });
    //        });
    //});
    //
    //it('SEND Suggestion UnAuthorized', function (done) {
    //
    //    var loginData = USERS.CLIENT;
    //    var data = {
    //        title: 'Need new license of service _________________',
    //        description: 'Need new license of ______________ service........ I license number: 2323324232432'
    //
    //    };
    //
    //    agent
    //        .post('/user/signOut')
    //        .send(loginData)
    //        .expect(200)
    //        .end(function (err, res) {
    //            if (err) {
    //                return done(err)
    //            }
    //
    //            agent
    //                .post('/sendSuggestion')
    //                .send(data)
    //                .expect(200)
    //                .end(function (err, res) {
    //                    if (err) {
    //                        return done(err)
    //                    }
    //                    console.dir(res.body);
    //                    done();
    //                });
    //        });
    //});

    // ------------
    it('SEND Poor Coverage', function (done) {

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

    it('SEND Poor Coverage UnAuthorized', function (done) {

        var loginData = USERS.CLIENT;
        var data = {
            address: 'New York main street',
            signalLevel: 4
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
                        if (err) {
                            return done(err)
                        }
                        console.dir(res.body);
                        done();
                    });
            });
    });

    it('SEND Poor Coverage UnAuthorized', function (done) {

        var loginData = USERS.CLIENT;
        var data = {
            address: 'Uzgorod siti, Shandora Petefi pl',
            signalLevel: 4,
            location: {
                latitude: '20.9821547',
                longitude: '18.402868'
            }
        };
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