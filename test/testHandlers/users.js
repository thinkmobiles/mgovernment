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
            preparingDb.dropCollection(CONST.MODELS.HISTORY + 's'),
            preparingDb.dropCollection(CONST.MODELS.USER_HISTORY + 's'),
            //preparingDb.createServiceByTemplate(SERVICES.SERVICE_GOLD_BANCOMAT_FOR_UPDATE),
            //preparingDb.createServiceByTemplate(SERVICES.SERVICE_CAPALABA_RITEILS),
            //preparingDb.createServiceByTemplate(SERVICES.SERVICE_CAPALABA_COMMUNICATIONS_GET),
            //preparingDb.createServiceByTemplate(SERVICES.SERVICE_SPEDTEST_INET),
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

    //it('Login with GOOD credentials (client123, pass1234)', function (done) {
    //
    //    var loginData = USERS.CLIENT_GOOD_USER_TYPE;
    //
    //    agent
    //        .post('/user/signIn')
    //        .send(loginData)
    //        .expect(200)
    //        .end(function (err, res) {
    //            if (err) {
    //                return done(err)
    //            }
    //            done();
    //        });
    //});
    //
    //it('Login with BAD credentials - wrong pass (client123, 123456)', function (done) {
    //
    //    var loginData = USERS.CLIENT_BAD_PASSWORD;
    //
    //    agent
    //        .post('/user/signIn')
    //        .send(loginData)
    //        .expect(400)
    //        .end(function (err, res) {
    //            if (err) {
    //                return done(err)
    //            }
    //            done();
    //        });
    //});
    //
    //it('SignOut if Logined (client123, pass1234)', function (done) {
    //
    //    var loginData = USERS.CLIENT_GOOD_DEVICE_OS;
    //    var loginData2 = USERS.CLIENT_GOOD_DEVICE_OS_DIFFERENT_DEVICE_TOKEN;
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
    //                .post('/user/signOut')
    //                .send(loginData2)
    //                .expect(200)
    //                .end(function (err, res) {
    //                    if (err) {
    //                        return done(err)
    //                    }
    //                    done();
    //                });
    //        });
    //});
    //
    it('SignOut if Unauthorized (client123, pass1234)', function (done) {

        var loginData = USERS.CLIENT_BAD_DEVICE_OS;

        agent
            .post('/user/signOut')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                done();
            });
    });

    it('Get UserProfile By Session if Unauthorized (client123, pass1234)', function (done) {

        var loginData = USERS.CLIENT_GOOD_DEVICE_OS;

        agent
            .get('/user/profile')
            .send(loginData)
            .expect(401)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                done();
            });
    });

    it('Get UserProfile By Session after logIn  (client123, pass1234)', function (done) {

        var loginData = USERS.CLIENT_GOOD_DIFFERENT_DEVICE_OS;

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .get('/user/profile')
                    .send(loginData)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        done();
                    });
            });
    });

    it('Get user by ID with client userType (client123, pass1234)', function (done) {

        agent
            .get('/user/profile/545465465464654')
            .expect(403)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                } else {
                    done();
                }
            });
    });

    it('Get user by BAD ID with admin userType (admin123, pass1234)', function (done) {

        var data = USERS.ADMIN;
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
                    .post('/user/')
                    .send(data)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        agent
                            .post('/user/signIn')
                            .send(data)
                            .expect(200)
                            .end(function (err, res) {
                                if (err) {
                                    return done(err)
                                }
                                agent
                                    .get('/user/profile/545465465464654')
                                    .expect(500)
                                    .end(function (err, res) {
                                        if (err) {
                                            return done(err);
                                        } else {
                                            done();
                                        }
                                    });
                            });
                    });
            });
    });

    it('POST Service account (client123, pass1234)', function (done) {

        var loginData = USERS.CLIENT;

        agent
            .post('/user/account')
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

    //it('POST duplicate Service account (client123, pass1234)', function (done) {
    //
    //    var loginData =  USERS.CLIENT;
    //
    //    agent
    //        .post('/user/account')
    //        .send(loginData)
    //        .expect(400)
    //        .end(function (err, res) {
    //            if (err) {
    //                return done(err)
    //            }
    //            done();
    //        });
    //});
    //
    //it('PUT  Service account (client123, pass1234)', function (done) {
    //
    //    var loginData =  USERS.CLIENT_CHANGE_ACCOUNT;
    //
    //    agent
    //        .put('/user/account')
    //        .send(loginData)
    //        .expect(200)
    //        .end(function (err, res) {
    //            if (err) {
    //                return done(err)
    //            }
    //            done();
    //        });
    //});
    //
    //it('Admin Create 1 Users', function (done) {
    //
    //    var loginData = USERS.ADMIN_DEFAULT;
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
    //            var layoutsCount = 0;
    //            var createUsersArray = [];
    //
    //            for (var i = 1; i > 0; i--) {
    //                createUsersArray.push(saveUser({
    //                    login: 'client123_' + i,
    //                    pass: 'pass1234_' + i,
    //                    userType: 'client'
    //                }));
    //            }
    //
    //            async.parallel(createUsersArray, function (err, results)   {
    //                if (err) {
    //                    return done(err)
    //                }
    //                console.log('ASYNC layoutsCount: ', layoutsCount);
    //                done();
    //            });
    //        });
    //});
    //
    //it('Admin GET Count of Users', function (done) {
    //
    //    agent
    //        .get('/user/getCount')
    //        .expect(200)
    //        .end(function (err, res) {
    //            if (err) {
    //                return done(err)
    //            }
    //            console.log('Count of  Users was get:');
    //            console.dir(res.body);
    //            done();
    //        });
    //});
    //
    //it('Admin Delete User by _id', function (done) {
    //
    //    var data = USERS.CLIENT_GOOD_USER_TYPE_FOR_DELETING;
    //
    //    agent
    //        .post('/user/')
    //        .send(data)
    //        .expect(200)
    //        .end(function (err, res) {
    //            if (err) {
    //                return done(err)
    //            }
    //            userId = res.body._id;
    //            console.log('id fo deleting: ',userId);
    //
    //            agent
    //                .delete('/user/' + userId)
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

    /*
     it('POST upload image', function (done) {

     var imageBase64 = IMAGES.avatar;
     var postData = {
     imageBase64: imageBase64
     };

     agent
     .post('/user/account/image/')
     .send(postData)
     .expect(200)
     .end(function (err, res) {
     if (err) {
     return done(err)
     }

     expect(res.body).to.have.property('imageId');
     tempImageId = res.body.imageId;

     done();
     });
     });

     var tempImageId;

     it('GET image by url', function (done) {

     agent
     .get('/user/account/image/' + tempImageId)
     .expect(200)
     .end(function (err, res) {
     if (err) {
     return done(err)
     }

     done();
     });
     });

     it('GET image by url (fake imageId)', function (done) {

     agent
     .get('/user/account/image/551137c2f9e1fac808a5f572')
     .expect(404)
     .end(function (err, res) {
     if (err) {
     return done(err)
     }

     done();
     });
     });

     it('REMOVE image by url', function (done) {

     agent
     .delete('/user/account/image/' + tempImageId)
     .expect(200)
     .end(function (err, res) {
     if (err) {
     return done(err)
     }

     done();
     });
     });
     */

    function saveUser(data) {
        return function (callback) {
            agent
                .post('/user/')
                .send(data)
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        return  callback(err)
                    }
                    callback();
                });
        }
    }
});