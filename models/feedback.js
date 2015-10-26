var CONST = require('../constants');

module.exports = function (db) {
    'use strict';

    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var Schema = mongoose.Schema;

    var feedback = new Schema({
        serviceName: String,
        service: {type: ObjectId, ref: CONST.MODELS.SERVICE, default: null},
        user: {type: ObjectId, ref: CONST.MODELS.USER, default: null},
        rate: String,
        feedback: String,
        createdAt: {type: Date, default: Date.now}
    }, {
        collection: CONST.MODELS.FEEDBACK + 's'
    });

    db.model(CONST.MODELS.FEEDBACK, feedback);
};
