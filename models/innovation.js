var CONST = require('../constants');

module.exports = function (db) {
    'use strict';

    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var schema = mongoose.Schema;

    var innovation = new schema({
        title: String,
        message: String,
        type: String,
        user: {type: ObjectId, ref: CONST.MODELS.USER, default: null},
        createdAt: {type: Date, default: Date.now}
    }, {
        collection: CONST.MODELS.INNOVATION + 's'
    });

    db.model(CONST.MODELS.INNOVATION, innovation);
};
