var CONST = require('../constants');
module.exports = function (db){
    'use strict';
    var mongoose = require('mongoose');
    var schema = mongoose.Schema;
    var user = new schema({
        login: {type: String, unique: true},
        pass: String,
        userType:String,
        devices: [],
        profile:{
            firstName: {type: String},
            lastName: String,
            createdAt: {type: Date, default: Date.now}
        },
        accounts:[{
            serviceProvider: String,
            serviceId: String,
            login: String,
            pass: String,
            lastSignInAt: Date,
            userCookie: String,
            cookieUpdatedAt: Date,
            accountUpdatedAt: Date
        }]





    }, {
        collection: CONST.MODELS.USER + 's'
    });
    db.model(CONST.MODELS.USER, user);

};
