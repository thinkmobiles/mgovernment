'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var app = require('../app');
var mongoose = require('mongoose');

var url = 'http://localhost:7791';

describe('user', function () {
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

        var dbConnection = mongoose.createConnection('localhost', 'mgovermentDB', 27017, connectOptions);

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
            .post('/user/create')
            .send(data)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }
                expect(res.body).to.have.property('login');
                expect(res.body).to.have.property('pass');
                expect(res.body).to.have.property('userType');
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

    it('Get user by ID', function (done) {

        agent
            .get('/users/' + userId)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                } else {
                    expect(res.body).to.have.property('firstname');
                    expect(res.body).to.have.property('lastname');
                    expect(res.body).to.have.property('username');
                    expect(res.body).to.have.property('email');
                    done();

                }
            });
    });

});