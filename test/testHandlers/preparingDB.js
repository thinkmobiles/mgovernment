var CONST = require('../../constants/index');
var mongoose = require('mongoose');
var request = require('supertest');

var USERS = require('./../testHelpers/usersTemplates');
var SERVICES = require('./../testHelpers/servicesTemplates');
var async = require ('async');

PreparingDb = function (){
    var count = count || 0;
    var crypto = require('crypto');
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
    var models = require('../../models/index')(dbConnection);
    var User = dbConnection.model(CONST.MODELS.USER);

    this.dropCollection = function (collection){
        var test = collection;

        dbConnection.collections[collection].drop(function(err,res) {
            if (err) {
                console.log(err)
            }

            console.log(res)

        });
    };


    this.toFillUsers = function (done, count) {
        createDefaultAdmin(function(err) {
            if (err) {
                return done(err);
            }

            for (var i = count-1; i>=0; i--) {

                var pass = 'pass1234'+i;
                var shaSum = crypto.createHash('sha256');
                shaSum.update(pass);
                pass = shaSum.digest('hex');

                saveUser({
                    login: CONST.USER_TYPE.CLIENT + '_' + i,
                    pass: pass,
                    userType: CONST.USER_TYPE.CLIENT
                });

                saveUser({
                    login: CONST.USER_TYPE.COMPANY + '_' + i,
                    pass: pass,
                    userType: CONST.USER_TYPE.COMPANY
                });
                saveUser({
                    login: CONST.USER_TYPE.GOVERNMENT + '_' + i,
                    pass: pass,
                    userType: CONST.USER_TYPE.GOVERNMENT
                });
            }
            return done();
        });


    };

    function saveUser (userTemplate) {

        var user = new User(userTemplate);

        user
            .save(function (err, user) {
                if(err){
                    return next(err);
                }
            });
    }

    function createDefaultAdmin(callback) {

        var pass = USERS.ADMIN_DEFAULT.pass;

        var shaSum = crypto.createHash('sha256');
        shaSum.update(pass);
        pass = shaSum.digest('hex');

        var admin = new User({
            login: USERS.ADMIN_DEFAULT.login,
            pass: pass,
            userType: CONST.USER_TYPE.ADMIN
        });

        admin
            .save(function (err, user) {
                if(err){
                    return callback(err);
                }
                callback();
            });
    }

};

module.exports = PreparingDb;