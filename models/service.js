var CONST = require('../constants');

module.exports = function (db) {
    'use strict';

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var serviceSchema = new Schema({
            serviceProvider: {type: String, required: true},
            serviceName: {},
            serviceType: {type: String, required: true},
            baseUrl: {type: String, required: true},
            profile: {},
            updatedAt: {type: Date},
            createdAt: {type: Date, default: Date.now},
            forUserType: {type:[], required: true},
            method: {type: String, required: true},
            port: {type: String},
            url: {type: String},
            params: {},

            inputItems: [{
                order: Number,
                name: String,
                inputType: String,
                placeHolder: {
                    EN: String,
                    AR: String
                },
                displayName: {
                    EN: String,
                    AR: String
                },
                required: Boolean,
                validateAs: String,
                dataSource: [],
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

