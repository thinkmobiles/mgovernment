var CONST = require('../constants');
var RESPONSE = require('../constants/response');

var UserService = function(db) {

    var mongoose = require('mongoose');
    var Service = db.model(CONST.MODELS.SERVICE);

    this.getServiceOptions = function(req, res, next) {

        var searchQuery = {
            _id: req.params.serviceId
        };

        Service
            .find(searchQuery)
            .exec(function (err, model) {
                if (err) {
                    return next(err);
                }
                return res.status(200).send(model);
            });

    };

    this.sendServiceRequest = function(req, res, next) {

    };
};

module.exports = UserService;