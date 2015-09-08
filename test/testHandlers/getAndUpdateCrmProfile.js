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

describe('Get And Update Crm Profile', function () {
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

    it('GET profile by SESSION ', function (done) {

        var loginData = USERS.CLIENT;

        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                console.dir(res.body);
                if (err) {
                    return done(err)
                }
                agent
                    .get('/crm/profile')
                    .expect(200)
                    .end(function (err, res) {
                        console.dir(res.body);
                        if (err) {
                            return done(err)
                        }
                        done();
                    });
            });
    });

    it('Change profile by SESSION ', function (done) {

        var loginData = USERS.CLIENT;
        var data = {
            "first": "Kofevarkas",
            "last": "Pilesos",
            "state": 3,
            "phone": "+380666012099",
            "streetAddress": "Yzhgorod, Mukhachivska street ",
            "avatar":"data:image/png;base64,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"
        };
        agent
            .post('/user/signIn')
            .send(loginData)
            .expect(200)
            .end(function (err, res) {
                console.dir(res.body);
                if (err) {
                    return done(err)
                }
                agent
                    .put('/crm/profile')
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
    });


});