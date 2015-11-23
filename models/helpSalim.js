var CONST = require('../constants');

module.exports = function (db) {
    'use strict';

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var helpSalim = new Schema({
        url: String,
        description: String,
        createdAt: {type: Date, default: Date.now}
    }, { collection : CONST.MODELS.HELP_SALIM + 's' });

    db.model(CONST.MODELS.HELP_SALIM, helpSalim);
};