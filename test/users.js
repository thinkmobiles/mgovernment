'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var app = require('../app');
var mongoose = require('mongoose');
var CONST = require('../constants');
var LAYUOTS = require('./testHelpers/layoutsTemplates');
var USERS = require('./testHelpers/usersTemplates');



var url = 'http://localhost:7791';

describe('User create/ logIn / logOut / getProfile / Device, Account (CRUD) ,', function () {
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

        var dbConnection = mongoose.createConnection(process.env.DB_HOST , process.env.DB_NAME, process.env.DB_PORT, connectOptions);

        dbConnection.once('open', function callback() {
            dbConnection.db.dropCollection('Users', function (err, result) {
                console.log('Collection Users dropped');
                done();
            });
        });
    });

    it('Create user', function (done) {
        var data = {
            login: 'client123',
            pass: 'pass1234',
            userType: 'client'
        };

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

    it('Login with GOOD credentials (client123, pass1234)', function (done) {
        var loginData = {
            login: 'client123',
            pass: 'pass1234'

        };

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                done();
            });
    });

    it('Login with BAD credentials - wrong pass (client123, 123456)', function (done) {
        var loginData = {
            login: 'client123',
            pass: '123456'
        };

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(400)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                done();
            });
    });

    it('SignOut if Logined (client123, pass1234)', function (done) {
        var loginData = {
            login: 'client123',
            pass: 'pass1234',
            deviceOs: "android",
            deviceToken: "Pilesos Token12343"
        };

        var loginData2 = {
            login: 'client123',
            pass: 'pass1234',
            deviceOs: "android",
            deviceToken: "Skovoroda Token12343"
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
                    .post('/user/signOut')
                    .send(loginData2)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }

                        done();
                    });
            });
    });

    it('SignOut if Unauthorized (client123, pass1234)', function (done) {
        var loginData = {
            login: 'client123',
            pass: 'pass1234',
            deviceOs: "ois--- bad IoS",
            deviceToken: "IClock  Token-----------------"
        };


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
        var loginData = {
            login: 'client123',
            pass: 'pass1234',
            deviceOs: "ois",
            deviceToken: "IClock  Token----"
        };


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
        var loginData = {
            login: 'client123',
            pass: 'pass1234',
            deviceOs: "windows",
            deviceToken: "Nokia  Token----"
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

    it('Get user by ID with admin userType (admin123, pass1234)', function (done) {
        var data = {
            login: 'admin123',
            pass: 'pass1234',
            userType: 'admin'
        };

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


    it('POST Service account (client123, pass1234)', function (done) {
        var loginData = {
            login: 'client123',
            pass: 'pass1234',
            "seviceName": "love.mail.ru",
            "seviceOptions": "love, meet, chat",
            "serviceLogin": "loveIs",
            "servicePass": "gtgtgtgt"
        };

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

    it('POST duplicate Service account (client123, pass1234)', function (done) {
        var loginData = {
            login: 'client123',
            pass: 'pass1234',
            "seviceName": "love.mail.ru",
            "seviceOptions": "love, meet, chat",
            "serviceLogin": "loveIs",
            "servicePass": "gtgtgtgt"
        };

        agent
            .post('/user/account')
            .send(loginData)
            .expect(400)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                done();
            });
    });

    it('PUT  Service account (client123, pass1234)', function (done) {
        var loginData = {
            login: 'client123',
            pass: 'pass1234',
            "seviceName": "love.mail.ru",
            "seviceOptions": "Game",
            "serviceLogin": "Client1",
            "servicePass": "Client2"
        };

        agent
            .put('/user/account')
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

/* --------------------------------------------------------------- LAYOUT TEST------------------------------------------------------*/

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

    it('Client GET Layout by layoutName', function (done) {


        agent
            .get('/clientLayout/' + LAYUOTS.START_SCREEN_LAYOUT.layoutName)
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

    it('Admin Create (POST) Item  by layoutName and ID', function (done) {
        var data = LAYUOTS.START_SCREEN_LAYOUT_ITEM_FOR_POST;


        agent
            .post('/adminLayout/' + data.layoutName + '/' + data.items[0].id)
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

    it('Admin Update (PUT) Item  by layoutName and ID', function (done) {
        var data = LAYUOTS.START_SCREEN_LAYOUT_ITEM_FOR_UPDATE;


        agent
            .put('/adminLayout/' + data.layoutName + '/' + data.items[0].id)
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

