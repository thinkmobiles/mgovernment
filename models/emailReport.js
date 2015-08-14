var CONST = require('../constants');

module.exports = function (db) {
    'use strict';

    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var schema = mongoose.Schema;

    var emailReport = new schema({
        response: {},
        title: String,
        attachment: String,
        description: String,
        location: {
            latitude: String,
            longitude: String
        },
        signalLevel: String,
        address: String,
        mailTo: String,
        serviceProvider: String,
        referenceNumber:String,
        serviceType: String,
        service: {type: ObjectId, ref: CONST.MODELS.SERVICE, default: null},
        user: {type: ObjectId, ref: CONST.MODELS.USER, default: null},
        createdAt: {type: Date, default: Date.now}
    }, {
        collection: CONST.MODELS.EMAIL_REPORT + 's'
    });

    db.model(CONST.MODELS.EMAIL_REPORT, emailReport);
};
