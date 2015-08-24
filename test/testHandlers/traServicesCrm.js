'use strict';

var request = require('supertest');
var expect = require('chai').expect;
var CONST = require('../../constants/index');
var USERS = require('./../testHelpers/usersTemplates');
var SERVICES = require('./../testHelpers/servicesTemplates');
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

    it('SEND data to ComplainSmsSpam', function (done) {

        var loginData = USERS.CLIENT_CRM_LOGIN_DATA;
        var data = {
            phone: '505050440',
            description: 'I receive 10 sms from this number 505050440'
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
                    .post('/crm/complainSmsSpam')
                    .send(data)
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

});