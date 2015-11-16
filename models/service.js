var CONST = require('../constants');

module.exports = function (db) {
    'use strict';

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var serviceSchema = new Schema({
            serviceProvider: {type: String, required: true},
            enable: {type: Boolean, default: true},
            serviceName: {
                EN: {type: String, default: ''},
                AR: {type: String, default: ''}
            },
            profile: {},
            icon: {type: ObjectId, ref: CONST.MODELS.SERVICES_ICON, default: null},

            url: {type: String, required: true},
            method: {type: String, required: true},
            params: {},
            port: {type: String},

            needAuth: {type: Boolean, default: false},
            forUserType: {type: [], default: [CONST.USER_TYPE.CLIENT]},

            updatedAt: {type: Date},
            createdAt: {type: Date, default: Date.now},

            buttonTitle: {
                EN: {type: String, default: ''},
                AR: {type: String, default: ''}
            },

            pages: [{
                number: Number,
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
                    additional: {}
                }]
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