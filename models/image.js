var CONST = require('../constants');

module.exports = function (db) {
    'use strict';

    var mongoose = require('mongoose');
    var schema = mongoose.Schema;

    var image = new schema({
        data: Buffer,
        contentType: String
    }, {
        collection: CONST.MODELS.IMAGE + 's'
    });

    db.model(CONST.MODELS.IMAGE, image);
};
