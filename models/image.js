var CONST = require('../constants');

module.exports = function (db) {
    'use strict';

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var image = new Schema({
        data: Buffer,
        contentType: String
    }, {
        collection: CONST.MODELS.IMAGE + 's'
    });

    db.model(CONST.MODELS.IMAGE, image);
};
