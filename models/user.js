var CONST = require('../constants');

module.exports = function (db) {
    'use strict';

    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;
    //var ObjectId = mongoose.Types.ObjectId;
    /// TODO   check ObjectId type
    var schema = mongoose.Schema;

    var user = new schema({
        login: {type: String, unique: true},
        pass: String,
        userType:String,
        devices: [],
        profile:{
            firstName: {type: String},
            lastName: String,
            gender: String,
            phone: String,
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
        }],
        favorites:[
            {type: ObjectId, ref: CONST.MODELS.SERVICE }
        ],
        avatar: {type: ObjectId, ref: CONST.MODELS.IMAGE + 's', default: null}
    }, {
        collection: CONST.MODELS.USER + 's'
    });

    db.model(CONST.MODELS.USER, user);
};
