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
var url = 'http://localhost:80';

describe('User register/ logIn / logOut', function () {

    var agent = request.agent(url);
    var userId;
    var serviceCollection;

    before(function (done) {
        this.timeout(15000);
        console.log('>>> before');

        var preparingDb = new PreparingBd();

        async.series([
            preparingDb.dropCollection(CONST.MODELS.USER + 's'),
            preparingDb.dropCollection(CONST.MODELS.SERVICE + 's'),
            //preparingDb.dropCollection(CONST.MODELS.ADMIN_HISTORY + 's'),
            //preparingDb.dropCollection(CONST.MODELS.USER_HISTORY + 's'),
            preparingDb.toFillUsers(1)
        ], function (err,results)   {
            if (err) {
                return done(err)
            }
            done();
        });
    });

    it('Register user', function (done) {

        var registerData = USERS.CLIENT_REGISTER_DATA;

        agent
            .post('/user/signOut')
            .send({})
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/user/register')
                    .send(registerData)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        done();
                    });
            });
    });

    it('Register same user', function (done) {

        var registerData = USERS.CLIENT_REGISTER_DATA;

        agent
            .post('/user/signOut')
            .send({})
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err)
                }

                agent
                    .post('/user/register')
                    .send(registerData)
                    .expect(400)
                    .end(function (err, res) {
                        if (err) {
                            return done(err)
                        }
                        done();
                    });
            });
    });

    it('Login with GOOD credentials', function (done) {

        var loginData = {
            login: USERS.CLIENT_REGISTER_DATA.login,
            pass: USERS.CLIENT_REGISTER_DATA.pass
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

    it('Login with BAD credentials - wrong pass', function (done) {

        var loginData = {
            login: USERS.CLIENT_REGISTER_DATA.login,
            pass: USERS.CLIENT_REGISTER_DATA.pass + 'badpass'
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

});