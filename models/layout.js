var CONST = require('../constants');

module.exports = function (db) {
    var mongoose = require('mongoose');

    var layoutSchema = mongoose.Schema({
            layoutName: {type: String},
            layoutType: {type: String},
            id:{type: String, unique: true},
            screenOptions:{},
            items: [{
                order: Number,
                name: String,
                itemType: String,
                dataSource: String,
                id:String,
                action: {}
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

