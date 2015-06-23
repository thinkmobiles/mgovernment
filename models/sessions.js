module.exports = function(db){
    'use strict';
    var mongoose = require('mongoose');
    var schema = mongoose.Schema;

    var session = new schema({
        sessionId: String
    }, {collection : 'Sessions'});

    db.model('session', session);
};