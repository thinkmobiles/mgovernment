var CONST = require('../constants');

module.exports = function (db) {
    'use strict';

    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var historyLogSchema = mongoose.Schema({
            user: {type: ObjectId, ref: CONST.MODELS.USER, default: null},
            action: {type: String},
            model: {type: String},
            modelId: {type: String},
            createdAt: {type: Date,  default: Date.now},
            description: {type: String}
        },
        {
            collection: CONST.MODELS.ADMIN_HISTORY + 's'
        });

    db.model(CONST.MODELS.ADMIN_HISTORY, historyLogSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }
    mongoose.Schemas[CONST.MODELS.ADMIN_HISTORY] = historyLogSchema;
};

