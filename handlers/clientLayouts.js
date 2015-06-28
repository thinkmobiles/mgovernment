var CONST = require('../constants');
var RESPONSE = require('../constants/response');

var Layout = function(db) {

    var mongoose = require('mongoose');
    var logWriter = require('../helpers/logWriter')();
    var async = require('async');
    var Layout = db.model(CONST.MODELS.LAYOUT);

    var ObjectId = mongoose.Types.ObjectId;



    this.getLayout = function (req, res, next) {
        //var searchName = req.query.name;

        //if (!searchName) {
        //    return res.status(400).send({err: RESPONSE.NOT_ENOUGH_PARAMS});
        //}

        findLayoutByName('startScreen', function (err, layout) {
            if (err) {
                return next(err);
            }
            return res.status(200).send(layout);
        })
    };

    function findLayoutByName(layoutName, callback) {
        Layout
            .findOne({name: layoutName})
            .exec(function (err, model) {
                if (err) {
                    return callback(err);
                }

                if (!model) {
                    var err = new Error('Not found Layout by name: ' + layoutName);
                    err.status = 404;
                    return callback(err);
                }
                return callback(null, model.toJSON());
            });
    }
};

module.exports = Layout;