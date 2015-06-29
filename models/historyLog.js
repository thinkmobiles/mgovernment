var CONST = require('../constants');

module.exports = function (db) {
    var mongoose = require('mongoose');

    var historyLogSchema = mongoose.Schema({
            userId: {type: String},
            action: {type: String},
            model: {type: String},
            modelId: {type: String},
            createdAt: {type: Date,  default: Date.now},
            description: {type: String}
        },
        {collection: 'HistoryLog'});

    db.model(CONST.MODELS.HISTORY, historyLogSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }
    mongoose.Schemas['HistoryLog'] = historyLogSchema;
};

