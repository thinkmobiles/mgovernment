var CONST = require('../constants');

module.exports = function (db) {
    'use strict';
    var mongoose = require('mongoose');
    var historyLogSchema = mongoose.Schema({
            userId: {type: String},
            action: {type: String},
            model: {type: String},
            modelId: {type: String},
            createdAt: {type: Date,  default: Date.now},
            description: {type: String}
        },
        {
            collection: CONST.MODELS.HISTORY + 's'
        });

    db.model(CONST.MODELS.HISTORY, historyLogSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }
    mongoose.Schemas[CONST.MODELS.HISTORY] = historyLogSchema;
};

