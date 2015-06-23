module.exports = function (db){
    'use strict';

    var mongoose = require('mongoose');
    var schema = mongoose.Schema;

    var ObjectId = mongoose.Schema.Types.ObjectId;

    var profile = new schema({
        firstName: {type: String},
        lastName: String,
        dateOfCreating: {type: Date, default: Date.now},
        owner: String
    }, {
        collection: 'Profiles'
    });

    var profileModel = db.model('profile', profile);

};