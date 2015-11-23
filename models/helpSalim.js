var CONST = require('../constants');

module.exports = function (db) {
    'use strict';

    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var Schema = mongoose.Schema;

    var helpSalim = new Schema({
        url: String,
        description: String,
        user: {type: ObjectId, ref: CONST.MODELS.USER, default: null},
        createdAt: {type: Date, default: Date.now}
    }, { collection : CONST.MODELS.HELP_SALIM + 's' });

    db.model(CONST.MODELS.HELP_SALIM, helpSalim);
};