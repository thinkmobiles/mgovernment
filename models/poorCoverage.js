var CONST = require('../constants');

module.exports = function (db) {
    'use strict';

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var poorCoverage = new Schema({
        address: String,
        signalLevel: String,
        location: {
            latitude: String,
            longitude: String
        },
        createdAt: {type: Date, default: Date.now}
    }, { collection : CONST.MODELS.POOR_COVERAGE + 's' });

    db.model(CONST.MODELS.POOR_COVERAGE, poorCoverage);
};