var CONST = require('../../constants/index');
var mongoose = require('mongoose');
var request = require('supertest');

var USERS = require('./../testHelpers/usersTemplates');
//var SERVICES = require('./../testHelpers/servicesTemplates');


PreparingDb = function (){

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
    var Service = dbConnection.model(CONST.MODELS.SERVICE);


    this.dropCollection = function (collection) {
        return function (callback) {

            dbConnection.collections[collection].drop(function (err) {
                if (err) {
                    if (err.errmsg != 'ns not found') {
                        return callback(err)
                    }
                }
                callback();
            });
        };
    };

    this.toFillUsers = function ( count) {
        return function (callback) {

            createDefaultAdmin(function (err) {

                var count = count || 1;

                if (err) {
                    callback(err);
                }


                for (var i = count - 1; i >= 0; i--) {

                    var pass = 'pass1234' + i;
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
                return callback();
            });

        };
    };

    this.createUsersByTemplate = function(userTemplate, count) {
        return function (callback) {

            var userTemplateCopy = JSON.parse(JSON.stringify(userTemplate));
            var count = count  || 1;
            var str ="";

            for (var i = count - 1; i >= 0; i--) {

                var pass = userTemplateCopy.pass;
                var shaSum = crypto.createHash('sha256');
                shaSum.update(pass);
                userTemplateCopy.pass = shaSum.digest('hex');
                userTemplateCopy.login = userTemplateCopy.login + str;

                saveUser(userTemplateCopy);
                str = 'auto' + i;
            }
            callback();
        }
    };

    this.createServiceByTemplate = function(serviceTemplate, forUserType) {
        return function (callback) {

            var serviceData = (JSON.parse(JSON.stringify(serviceTemplate)));
            serviceData.forUserType = forUserType || serviceData.forUserType;
            serviceData.serviceName = serviceData.serviceName;

            saveService(serviceData);
            callback();
        }
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

    function saveService (serviceTemplate) {
        var service = new Service(serviceTemplate);

        service
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