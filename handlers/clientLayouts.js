var CONST = require('../constants');
var RESPONSE = require('../constants/response');

var Layout = function(db) {

    var mongoose = require('mongoose');
    var logWriter = require('../helpers/logWriter')();
    var async = require('async');
    var Layout = db.model(CONST.MODELS.LAYOUT);

    var ObjectId = mongoose.Types.ObjectId;



    this.getLayout = function (req, res, next) {
        var searchQuery = {
            'layoutName': req.params.layoutName
        };

        if (!searchQuery.layoutName) {
            return res.status(400).send({err: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        findLayoutByQuery(searchQuery, function (err, layout) {
            if (err) {
                return next(err);
            }
            return res.status(200).send(layout);
        })
    };

    function findLayoutByQuery(Query, callback) {
        Layout
            .findOne(Query)
            .exec(function (err, model) {
                if (err) {
                    return callback(err);
                }

                if (!model) {
                    var err = new Error('Not found Layout by query: ' + Query);
                    err.status = 404;
                    return callback(err);
                }
                return callback(null, model);
            });
    }
};

module.exports = Layout;