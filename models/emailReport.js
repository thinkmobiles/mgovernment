var CONST = require('../constants');

module.exports = function (db) {
    'use strict';

    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var schema = mongoose.Schema;

    var emailReport = new schema({
        response: {},
        title: String,
        description: String,
        mailTo: String,
        serviceType: String,

        //serviceId: {type: ObjectId, ref: CONST.MODELS.SERVICE, default: null},
        userId: {type: ObjectId, ref: CONST.MODELS.USER, default: null},
        //rate: String,
        //feedback: String,
        createdAt: {type: Date, default: Date.now}
    }, {
        collection: CONST.MODELS.EMAIL_REPORT + 's'
    });

    db.model(CONST.MODELS.EMAIL_REPORT, emailReport);
};