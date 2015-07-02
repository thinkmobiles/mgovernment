var CONST = require('../constants');

module.exports = function (db) {
    'use strict';
    var mongoose = require('mongoose');
    var serviceSchema = mongoose.Schema({
            serviceProvider: {type: String, required: true},
            serviceName: {type: String, required: true},
            serviceType: {type: String, required: true},
            baseUrl:{type: String, required: true},
            profile:{},
            updatedAt: {type: Date},
            createdAt: {type: Date, default: Date.now},
            forUserType: {type:[], required: true},
            method: {type: String, required: true},
            url: {type: String, required: true},
            params: [],

            inputItems: [{
                order: Number,
                name: String,
                inputType: String,
                placeHolder: String,
                options:[]
            }]
        },
        {
            collection: CONST.MODELS.SERVICE + 's'
        });

    db.model(CONST.MODELS.SERVICE, serviceSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas[CONST.MODELS.SERVICE] = serviceSchema;
};

