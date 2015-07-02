'use strict';

var request = require('supertest');
var mongoose = require('mongoose');
var CONST = require('../../constants/index');
var SERVICES = require('./../testHelpers/servicesTemplates');
var USERS = require('./../testHelpers/usersTemplates');
var async =  require('async');

var url = 'http://localhost:7791';

describe('Service create(POST) /  GET / PUT  / (CRUD) ,', function () {

    var agent = request.agent(url);
    var serviceId;

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
            dbConnection.db.dropCollection(CONST.MODELS.SERVICE + 's', function (err, result) {
                console.log('Collection ',CONST.MODELS.SERVICE + 's',' dropped');
                done();
            });
        });
    });

    it('Admin Create Service', function (done) {

        var loginData = USERS.ADMIN_DEFAULT;
        var data = SERVICES.SERVICE_SPEDTEST_INET;

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/adminService/')
                    .send(data)
                    .expect(201)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        serviceId = res.body._id;
                        console.log(serviceId);
                        done();
                    });
            });
    });

    it('Admin GET Service by  _id', function (done) {

        agent
            .get('/adminService/' + serviceId)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                console.log('Service was get:');
                console.dir(res.body);
                done();
            });
    });

    it('Admin PUT Service by service _id', function (done) {

        var data = SERVICES.SERVICE_GOLD_BANCOMAT;
        var dataForUpdate = SERVICES.SERVICE_GOLD_BANCOMAT_FOR_UPDATE;

        agent
            .post('/adminService/')
            .send(data)
            .expect(201)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                serviceId = res.body._id;
                console.log(serviceId);

                agent
                    .put('/adminService/' + serviceId)
                    .send(dataForUpdate)
                    .expect(202)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        console.dir(res.body);
                        done();
                    });
            });
    });
    //
    //it('Admin GET Item by layout _id and ItemId ', function (done) {
    //
    //    agent
    //        .get('/adminLayout/' + LAYUOTS.START_SCREEN_LAYOUT._id + '/' + 'loginButton')
    //        .expect(200)
    //        .end(function (err, res) {
    //            if (err) {
    //                return done(err)
    //            }
    //            console.log('Item was get:');
    //            console.dir(res.body);
    //            done();
    //        });
    //});
    //
    //it('Client GET Layout by layout _id', function (done) {
    //
    //    agent
    //        .get('/clientLayout/' + LAYUOTS.START_SCREEN_LAYOUT._id)
    //        .expect(200)
    //        .end(function (err, res) {
    //            if (err) {
    //                return done(err)
    //            }
    //            console.log('Layout was get:');
    //            console.dir(res.body);
    //            done();
    //        });
    //});
    //
    //it('Admin Create (POST) Item  by layout _id and ItemId', function (done) {
    //    var data = LAYUOTS.START_SCREEN_LAYOUT_ITEM_FOR_POST;
    //
    //    agent
    //        .post('/adminLayout/' + data._id+ '/' + data.items[0].id)
    //        .send(data)
    //        .expect(201)
    //        .end(function (err, res) {
    //            if (err) {
    //                return done(err)
    //            }
    //            console.log('Item was post:');
    //            console.dir(res.body);
    //            done();
    //        });
    //});
    //
    //it('Admin Update (PUT) Item  by layout _id and ItemId', function (done) {
    //    var data = LAYUOTS.START_SCREEN_LAYOUT_ITEM_FOR_UPDATE;
    //    var currDate = new Date();
    //
    //    while (new Date() - currDate < 1000) {}
    //
    //    agent
    //        .put('/adminLayout/' + data._id + '/' + data.items[0].id)
    //        .send(data)
    //        .expect(202)
    //        .end(function (err, res) {
    //            if (err) {
    //                return done(err)
    //            }
    //            console.log('Update Item result:');
    //            console.dir(res.body);
    //            done();
    //        });
    //});
    //
    //
    //it('Admin GET ALL Layouts', function (done) {
    //
    //    agent
    //        .get('/adminLayout/')
    //        .expect(200)
    //        .end(function (err, res) {
    //            if (err) {
    //                return done(err)
    //            }
    //            console.log('All Layouts was get:');
    //            console.dir(res.body);
    //            done();
    //        });
    //});
    //
    //it('Admin Create 100 Layouts', function (done) {
    //
    //    var layoutsCount = 0;
    //    var createLayoutArray = [];
    //
    //    for (var i = 100; i > 0; i--) {
    //        createLayoutArray.push(saveLayout({_id: '100_Layouts_number__' + i, layoutName: i + ' ScreeLayout', layoutId: i + '__ScreeLayoutID'  }));
    //    }
    //
    //    async.parallel(createLayoutArray, function (err,results)   {
    //        if (err) {
    //            return done(err)
    //        }
    //        console.log('ASYNC layoutsCount: ', layoutsCount);
    //        done();
    //    });
    //});
    //
    //function saveLayout(data) {
    //    return function (callback) {
    //        agent
    //            .post('/adminLayout/')
    //            .send(data)
    //            .expect(201)
    //            .end(function (err, res) {
    //                if (err) {
    //                    return  callback(err)
    //                }
    //                callback();
    //            });
    //    }
    //}
    //
    //it('Admin GET Count of Layouts', function (done) {
    //
    //    agent
    //        .get('/adminLayout/getCount')
    //        .expect(200)
    //        .end(function (err, res) {
    //            if (err) {
    //                return done(err)
    //            }
    //            console.log('Count of Layouts was get:');
    //            console.dir(res.body);
    //            done();
    //        });
    //});
    //

    it('Admin GET ALL Services with Query', function (done) {

        agent
            .get('/adminService/?orderBy=createAt&order=1&page=1&count=20')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                console.log('All Services was get:');
                console.dir(res.body);
                done();
            });
    });
});

