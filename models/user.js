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
            dateOfCreating: {type: Date, default: Date.now}
        },
        accounts:[]
    }, {
        collection: CONST.MODELS.USER + 's'
    });
    db.model(CONST.MODELS.USER, user);

};
