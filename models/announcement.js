var CONST = require('../constants');

module.exports = function (db) {
    'use strict';

    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var Schema = mongoose.Schema;

    var announcement = new Schema({
        title: String,
        description: String,
        image: {type: String, default: null},
        pubDate: {type: Date, default: Date.now},
        link: String,
        createdAt: {type: Date, default: Date.now}
    }, {
        collection: CONST.MODELS.ANNOUNCEMENT + 's'
    });

    db.model(CONST.MODELS.ANNOUNCEMENT, announcement);
};
