'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var app = require('../app');
var mongoose = require('mongoose');
var CONST = require('../constants');
var LAYUOTS = require('./testHelpers/layoutsTemplates');
var USERS = require('./testHelpers/usersTemplates');

var url = 'http://localhost:7791';

describe('Layout create(POST) /  GET / PUT  / (CRUD) ,', function () {
    var userId;
    var agent = request.agent(url);

    before(function (done) {
        console.log('>>> before');

        var connectOptions = {
            db: {native_parser: false},
            server: {poolSize: 5},
            user: process.env.DB_USER,
            pass: process.env.DB_PASS,
            w: 1,
            j: true,
            mongos: true
        };

        var dbConnection = mongoose.createConnection(process.env.DB_HOST, process.env.DB_NAME, process.env.DB_PORT, connectOptions);

        dbConnection.once('open', function callback() {
            dbConnection.db.dropCollection('Layouts', function (err, result) {
                console.log('Collection Layouts dropped');
                done();
            });
        });
    });

    it('Admin Create Layout', function (done) {
        var loginData = USERS.ADMIN;
        var data = LAYUOTS.START_SCREEN_LAYOUT;

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/adminLayout/')
                    .send(data)
                    .expect(201)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }

                        done();
                    });
            });
    });



    it('Admin GET Layout by layout _id', function (done) {


        agent
            .get('/adminLayout/' + LAYUOTS.START_SCREEN_LAYOUT._id)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                console.log('Layout was get:');
                console.dir(res.body);
                done();
            });
    });


    it('Admin PUT Layout by layout _id', function (done) {
        var data = LAYUOTS.SERVICES_LIST_SCREEN_LAYOUT_BEFORE_UPDATING;
        var dataForUpdate = LAYUOTS.SERVICES_LIST_SCREEN_LAYOUT_FOR_UPDATING;

        agent
            .post('/adminLayout/')
            .send(data)
            .expect(201)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .put('/adminLayout/' + dataForUpdate._id)
                    .send(dataForUpdate)
                    .expect(202)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }

                        done();
                    });
            });
    });

    it('Admin GET Item by layout _id and ItemId ', function (done) {


        agent
            .get('/adminLayout/' + LAYUOTS.START_SCREEN_LAYOUT._id + '/' + 'loginButton')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                console.log('Item was get:');
                console.dir(res.body);
                done();
            });
    });

    it('Client GET Layout by layout _id', function (done) {


        agent
            .get('/clientLayout/' + LAYUOTS.START_SCREEN_LAYOUT._id)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                console.log('Layout was get:');
                console.dir(res.body);
                done();
            });
    });

    it('Admin Create (POST) Item  by layout _id and ItemId', function (done) {
        var data = LAYUOTS.START_SCREEN_LAYOUT_ITEM_FOR_POST;


        agent
            .post('/adminLayout/' + data._id+ '/' + data.items[0].id)
            .send(data)
            .expect(201)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                console.log('Item was post:');
                console.dir(res.body);
                done();
            });
    });

    it('Admin Update (PUT) Item  by layout _id and ItemId', function (done) {
        var data = LAYUOTS.START_SCREEN_LAYOUT_ITEM_FOR_UPDATE;
        var currDate = new Date();

        while (new Date() - currDate < 1000) {}


        agent
            .put('/adminLayout/' + data._id + '/' + data.items[0].id)
            .send(data)
            .expect(202)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                console.log('Update Item result:');
                console.dir(res.body);
                done();
            });
    });

    it('Admin GET ALL Layouts', function (done) {


        agent
            .get('/adminLayout/')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                console.log('All Layouts was get:');
                console.dir(res.body);
                done();
            });
    });


});

