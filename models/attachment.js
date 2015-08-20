var CONST = require('../constants');

module.exports = function (db) {
    'use strict';

    var mongoose = require('mongoose');
    var schema = mongoose.Schema;

    var attachment  = new schema({
        attachment: String
    }, {
        collection: CONST.MODELS.ATTACHMENT + 's'
    });

    db.model(CONST.MODELS.ATTACHMENT , attachment );
};
