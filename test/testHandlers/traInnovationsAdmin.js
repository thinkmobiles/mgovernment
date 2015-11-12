'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var CONST = require('../../constants/index');
var USERS = require('./../testHelpers/usersTemplates');
var async = require ('async');
var PreparingBd = require('./preparingDb');
var url = 'http://localhost:80';

var app = require('../../app');

describe('Admin Innovations', function () {
    this.timeout(10000);

    var agent = request.agent(app);
    var preparingDb = new PreparingBd();

    var editInnovationId;
    var deletedInnovationId;

    before(function (done) {
        this.timeout(30000);
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

    it('Admin Create Innovation', function (done) {

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
                    .post('/innovation/admin')
                    .send({
                        title: 'test',
                        message: 'some message',
                        type: 1
                    })
                    .expect(201)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }

                        expect(res.body).not.be.empty;

                        console.dir(res.body);

                        done();
                    });
            });
    });

    it('Admin Get All Innovations', function (done) {

        var loginData = USERS.ADMIN_DEFAULT;

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                agent
                    .get('/innovation')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        editInnovationId = res.body[0]._id;
                        deletedInnovationId = res.body[1]._id;

                        expect(res.body).not.be.empty;
                        expect(res.body).to.be.instanceOf(Array);

                        done();
                    });
            });
    });

    it('Admin Edit Innovation', function (done) {

        var loginData = USERS.ADMIN_DEFAULT;

        var editData = {
            title: 'edit',
            message: 'edit Innovation',
            type: '3'
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
                    .put('/innovation/admin/'+editInnovationId)
                    .send({
                        title: editData.title,
                        message: editData.message,
                        type: editData.type
                    })
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        agent
                            .get('/innovation/admin/'+editInnovationId)
                            .expect(200)
                            .end(function (err, res) {
                                if (err) {
                                    return done(err)
                                }

                                expect(res.body.title).to.equal(editData.title);
                                expect(res.body.message).to.equal(editData.message);
                                expect(res.body.type).to.equal(editData.type);

                                done();
                            });
                    });
            });
    });

    it('Admin Edit Innovation With BAD params', function (done) {

        var loginData = USERS.ADMIN_DEFAULT;

        var editData = {
            title: 'edit',
            message: 'edit Innovation',
            type: '35'
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
                    .put('/innovation/admin/'+editInnovationId)
                    .send({
                        title: editData.title,
                        message: editData.message,
                        type: editData.type
                    })
                    .expect(400)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        done();
                    });
            });
    });

    it('Admin Delete Innovation', function (done) {

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
                    .delete('/innovation/admin/'+deletedInnovationId)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        agent
                            .get('/innovation/admin/'+deletedInnovationId)
                            .expect(404)
                            .end(function (err, res) {
                                if (err) {
                                    return done(err);
                                }

                                expect(res.body).to.be.empty;

                                done()
                            });
                    });
            });
    });

});