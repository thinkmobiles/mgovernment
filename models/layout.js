var CONST = require('../constants');

module.exports = function (db) {
    var mongoose = require('mongoose');

    var layoutSchema = mongoose.Schema({
            layoutName: {type: String},
            layoutType: {type: String},
            layoutId:{type: String, unique: true},
            _id:{type: String, unique: true},
            updatedAt: {type: Date},
            createdAt: {type: Date,  default: Date.now},
            screenOptions:{},
            items: [{
                order: Number,
                name: String,
                itemType: String,
                dataSource: String,
                id:String,
                action: {}
            }]

        },
        {collection: 'Layouts'});

    db.model(CONST.MODELS.LAYOUT, layoutSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['Layout'] = layoutSchema;
};

