
module.exports = function (db){
    'use strict';

    var mongoose = require('mongoose');
    var schema = mongoose.Schema;
    var user = new schema({
        login: {type: String, unique: true},
        pass: String,
        userType:String,
        devices: []
        }, {
            collection: 'Users'
        });
    db.model('user', user);

};
