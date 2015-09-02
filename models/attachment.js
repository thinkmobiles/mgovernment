var CONST = require('../constants');

module.exports = function (db) {
    'use strict';

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var attachment  = new Schema({
        attachment: String
    }, {
        collection: CONST.MODELS.ATTACHMENT + 's'
    });

    db.model(CONST.MODELS.ATTACHMENT , attachment );
};
