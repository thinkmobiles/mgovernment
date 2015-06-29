var CONST = require('../constants');
var RESPONSE = require('../constants/response');

var HistoryHandler = function(db) {

    var mongoose = require('mongoose');
    var logWriter = require('../helpers/logWriter')();
    var History = db.model(CONST.MODELS.HISTORY);

    this.pushlog = function(log) {
        var history = new History(log);
        history
            .save(function (err, user) {
                if (err) {
                    return res.status(500).send(err)
                }

            });
    }

};
module.exports = HistoryHandler;