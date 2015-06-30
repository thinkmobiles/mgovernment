var CONST = require('../constants');
var RESPONSE = require('../constants/response');

var Layout = function(db) {

    var async = require('async');
    var Layout = db.model(CONST.MODELS.LAYOUT);

    this.getLayoutById = function (req, res, next) {
        var searchQuery = {
            '_id': req.params.id
        };

        if (!searchQuery._id) {
            return res.status(400).send({err: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        findLayoutByQuery(searchQuery, function (err, layout) {
            if (err) {
                return next(err);
            }
            return res.status(200).send(layout);
        })
    };

    function findLayoutByQuery(query, callback) {
        Layout
            .findOne(query)
            .exec(function (err, model) {
                if (err) {
                    return callback(err);
                }

                if (!model) {
                    var err = new Error(RESPONSE.ON_ACTION.NOT_FOUND + query);
                    err.status = 404;
                    return callback(err);
                }
                return callback(null, model);
            });
    }
};

module.exports = Layout;