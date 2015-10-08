'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var CONST = require('../../constants/index');
var USERS = require('./../testHelpers/usersTemplates');
var SERVICES = require('./../testHelpers/servicesTemplates');
var async = require ('async');
var PreparingBd = require('./preparingDb');
var url = 'http://localhost:80';

var app = require('../../app');

describe('User CRM change Profile, change Pass, forgot Pass', function () {
    this.timeout(10000);

    var agent = request.agent(app);
    var preparingDb = new PreparingBd();

    before(function (done) {
        this.timeout(50000);
        console.log('>>> before');

        async.series([
            preparingDb.dropCollection(CONST.MODELS.USER + 's'),
            preparingDb.toFillUsers(1)
        ], function (err, results) {
            if (err) {
                return done(err)
            }
            done();
        });
    });

    it('CRM User Get Profile', function (done) {
        this.timeout(20000);

        var loginData = {
            login: USERS.CLIENT_REGISTER_DATA.login,
            pass: USERS.CLIENT_REGISTER_DATA.pass
        };

        agent
            .post('/crm/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .get('/crm/profile')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }

                        console.dir(res.body);
                        expect(res.body).to.have.property('first');
                        expect(res.body).to.have.property('last');

                        done();
                    });
            });
    });

    it('CRM User Get Profile Picture', function (done) {
        this.timeout(20000);

        var loginData = {
            login: USERS.CLIENT_REGISTER_DATA.login,
            pass: USERS.CLIENT_REGISTER_DATA.pass
        };

        agent
            .post('/crm/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .get('/crm/profileImage')
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

    it('CRM User Set Profile', function (done) {
        this.timeout(20000);

        var loginData = {
            login: USERS.CLIENT_REGISTER_DATA.login,
            pass: USERS.CLIENT_REGISTER_DATA.pass
        };

        var changeProfileData = {
            first: USERS.CLIENT_REGISTER_DATA.first + 'SomeTest',
            last: USERS.CLIENT_REGISTER_DATA.last + 'SomeTest'
        };

        agent
            .post('/crm/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .put('/crm/profile')
                    .send(changeProfileData)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }

                        agent
                            .get('/crm/profile')
                            .expect(200)
                            .end(function (err, res) {
                                if (err) {
                                    return done(err)
                                }

                                console.dir(res.body);
                                expect(res.body).to.have.property('first');
                                expect(res.body).to.have.property('last');
                                expect(res.body.first).to.equal(USERS.CLIENT_REGISTER_DATA.first + 'SomeTest');
                                expect(res.body.last).to.equal(USERS.CLIENT_REGISTER_DATA.last + 'SomeTest');

                                done();
                            });
                    });
            });
    });

    it('CRM User Set Profile With Avatar', function (done) {
        this.timeout(20000);

        var loginData = {
            login: USERS.CLIENT_REGISTER_DATA.login,
            pass: USERS.CLIENT_REGISTER_DATA.pass
        };

        var changeProfileData = {
            first: USERS.CLIENT_REGISTER_DATA.first,
            last: USERS.CLIENT_REGISTER_DATA.last,
            image: 'data:image/jpeg;base64,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'
        };

        agent
            .post('/crm/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .put('/crm/profile')
                    .send(changeProfileData)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }

                        agent
                            .get('/crm/profile')
                            .expect(200)
                            .end(function (err, res) {
                                if (err) {
                                    return done(err)
                                }

                                console.dir(res.body);
                                expect(res.body).to.have.property('first');
                                expect(res.body).to.have.property('last');
                                expect(res.body.first).to.equal(USERS.CLIENT_REGISTER_DATA.first);
                                expect(res.body.last).to.equal(USERS.CLIENT_REGISTER_DATA.last);

                                done();
                            });
                    });
            });
    });

/*
    it('CRM User Change Pass', function (done) {
        this.timeout(20000);

        var loginData = {
            login: USERS.CLIENT_REGISTER_DATA.login,
            pass: USERS.CLIENT_REGISTER_DATA.pass
        };

        agent
            .post('/crm/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .put('/crm/changePass')
                    .send({
                        oldPass: USERS.CLIENT_REGISTER_DATA.pass,
                        newPass: USERS.CLIENT_REGISTER_DATA.pass + 'newPass'
                    })
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }

                        done();
                    });
            });
    });

    it('CRM User login with old Pass', function (done) {
        this.timeout(20000);

        var loginData = {
            login: USERS.CLIENT_REGISTER_DATA.login,
            pass: USERS.CLIENT_REGISTER_DATA.pass
        };

        agent
            .post('/crm/signIn')
            .send(loginData)
            .expect(400)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                done();
            });
    });

    it('CRM User Change Pass to Old', function (done) {
        this.timeout(20000);

        var loginData = {
            login: USERS.CLIENT_REGISTER_DATA.login,
            pass: USERS.CLIENT_REGISTER_DATA.pass + 'newPass'
        };

        agent
            .post('/crm/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .put('/crm/changePass')
                    .send({
                        oldPass: USERS.CLIENT_REGISTER_DATA.pass + 'newPass',
                        newPass: USERS.CLIENT_REGISTER_DATA.pass
                    })
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }

                        done();
                    });
            });
    });

    it('CRM Forgot Password', function (done) {
        this.timeout(20000);

        agent
            .post('/crm/signOut')
            .send({})
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/crm/forgotPass')
                    .send({
                        email: USERS.CLIENT_REGISTER_DATA.email
                    })
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        console.log(res.body);

                        done();
                    });
            });
    });
*/
});