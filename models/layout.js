module.exports = function () {
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

    mongoose.model('Layout', layoutSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['Layout'] = layoutSchema;
};