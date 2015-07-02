var CONST = require('../constants');
var RESPONSE = require('../constants/response');

var UserService = function(db) {

    var mongoose = require('mongoose');
    var Service = db.model(CONST.MODELS.SERVICE);

    this.getServiceOptions = function(req, res, next) {

    };

    this.sendServiceRequest = function(req, res, next) {

    };
};

module.exports = UserService;