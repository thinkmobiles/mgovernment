var CONST = require('../constants');

module.exports = function (db) {
    var mongoose = require('mongoose');

    var serviceSchema = mongoose.Schema({
        serviceProvider: {type: String},
        serviceType: {type: String},
        baseUrl:{type: String},
        profile:{},
        updatedAt: {type: Date},
        createdAt: {type: Date,  default: Date.now},
        forUserType:[],
        inputItems: [{
            order: Number,
            name: String,
            type: String,
            options:[]
        }],
        method: {type: String},
        url: {type: String},
        params: []
},
{
    collection: CONST.MODELS.SERVICE + 's'
});

db.model(CONST.MODELS.LAYOUT, serviceSchema);

if (!mongoose.Schemas) {
    mongoose.Schemas = {};
}

mongoose.Schemas[CONST.MODELS.SERVICE] = serviceSchema;
};

