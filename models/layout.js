var CONST = require('../constants');

module.exports = function (db) {
    var mongoose = require('mongoose');

    var layoutSchema = mongoose.Schema({
            name: {type: String, unique: true},
            items: [{
                order: Number,
                name: String,
                itemType: String,
                action: String
            }],
            lastChange: {type: Date}
        },
        {collection: 'Layouts'});

    db.model(CONST.MODELS.LAYOUT, layoutSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['Layout'] = layoutSchema;
};