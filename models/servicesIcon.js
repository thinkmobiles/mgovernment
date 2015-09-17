var CONST = require('../constants');

module.exports = function (db) {
    'use strict';

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var servicesIcon  = new Schema({
        servicesId:[],
        title:{type: String, required: true},
        '@2x': {type: String, required: true},
        '@3x': {type: String, required: true},
        'xxxhdpi': {type: String, required: true},
        'xxhdpi': {type: String, required: true},
        'xhdpi': {type: String, required: true},
        'hdpi': {type: String, required: true},
        'mdpi': {type: String, required: true},
        createdAt: {type: Date,  default: Date.now},
        updatedAt: {type: Date,  default: Date.now}
    }, {
        collection: CONST.MODELS.SERVICES_ICON + 's'
    });

    db.model(CONST.MODELS.SERVICES_ICON, servicesIcon );
};
