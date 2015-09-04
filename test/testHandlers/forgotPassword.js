'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var CONST = require('../../constants/index');
var USERS = require('./../testHelpers/usersTemplates');
var SERVICES = require('./../testHelpers/servicesTemplates');
var TRA = require('../../constants/traServices');
var async =  require('async');
var PreparingDB = require('./preparingDB');
var url = 'http://localhost:7791';

describe('TRA CRM Services tests SMSSpam', function () {
    this.timeout(40000);

    var agent = request.agent(url);
    var serviceCollection;

    before(function (done) {
        console.log('>>> before');

        var preparingDb = new PreparingDB();

        async.series([
                preparingDb.dropCollection(CONST.MODELS.USER + 's'),
                preparingDb.toFillUsers(1),
                preparingDb.createUsersByTemplate(USERS.CLIENT)
            ],
            function (err, results) {
                if (err) {
                    return done(err)
                }
                done();
            });
    });

    it('SEND forgot password', function (done) {

        var data = {
            email: 'allotheremails@ukr.net'
        };
        agent
            .post('/crm/forgotPass')
            .send(data)
            .expect(200)
            .end(function (err, res) {
                console.dir(res.body);
                if (err) {
                    return done(err)
                }
                done();
            });
    });

    it('SEND get Change password with GOOD token', function (done) {

        var data = {
            email: 'allotheremails@ukr.net'
        };
        agent
            .get('/crm/changePass/2RK81jeYIC9WoqsO8n1IazLk17K77x4QQj582d6GLi4iHw1121V1441349037261')
            .send(data)
            .expect(200)
            .end(function (err, res) {
                console.dir(res.text);
                if (err) {
                    return done(err)
                }
                done();
            });
    });

    it('SEND get Change password with BAD token', function (done) {

        var data = {
            email: 'allotheremails@ukr.net'
        };
        agent
            .get('/crm/changePass/2RK81jeYIC9WoqsO8~~~~~.Lk17K77x4QQj582d6GLi4iHw1121V1441349037261')
            .send(data)
            .expect(404)
            .end(function (err, res) {
                //console.dir(res);
                if (err) {
                    return done(err)
                }
                done();
            });
    });

    it('SEND Change password with BAD password', function (done) {

        var data = {
            newPass: '12345678',
            confirmPass:'876543421'
        };
        agent
            .post('/crm/changePass/2RK81jeYIC9WoqsO8Lk17K77x4QQj582d6GLi4iHw1121V1441349037261')
            .send(data)
            .expect(400)
            .end(function (err, res) {
                console.dir(res.body);
                if (err) {
                    return done(err)
                }
                done();
            });
    });

    it('SEND Change password with NoExist token', function (done) {

        var data = {
            newPass: '12345678',
            confirmPass:'12345678'
        };
        agent
            .post('/crm/changePass/2RK81jeYIC9WoqsO8Lk17K77x4QQj582d6GLi4iHw1121V1441349037261')
            .send(data)
            .expect(400)
            .end(function (err, res) {
                console.dir(res.body);
                if (err) {
                    return done(err)
                }
                done();
            });
    });

});