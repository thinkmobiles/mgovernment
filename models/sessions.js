var CONST = require('../constants');
module.exports = function(db){
    'use strict';
    var mongoose = require('mongoose');
    var schema = mongoose.Schema;
    var session = new schema({
        sessionId: String
    }, {
        collection : CONST.MODELS.SESSION + 's'
    });

    db.model(CONST.MODELS.SESSION, session);
};