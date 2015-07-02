'use strict';

var request = require('supertest');
var mongoose = require('mongoose');
var CONST = require('../../constants/index');

var url = 'http://localhost:7791';

describe('Service User: GET options, POST send request', function () {

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

    it('Admin Create Service', function (done) {

        var loginData = USERS.ADMIN_DEFAULT;
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

});