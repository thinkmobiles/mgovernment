var CONST = require('../constants');

module.exports = function (db) {
    'use strict';

    var mongoose = require('mongoose');
    var userHistoryLogSchema = mongoose.Schema({
            userId: {type: String},
            action: {type: String},
            model: {type: String},
            modelId: {type: String},
            req: {params: {}, body: {}},
            res: {},
            createdAt: {type: Date,  default: Date.now},
            description: {type: String}
        },
        {
            collection: CONST.MODELS.USER_HISTORY + 's'
        });

    db.model(CONST.MODELS.USER_HISTORY, userHistoryLogSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }
    mongoose.Schemas[CONST.MODELS.USER_HISTORY] = userHistoryLogSchema;
};

