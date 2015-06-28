var CONST = require('../constants');
var RESPONSE = require('../constants/response');

var Layout = function(db) {

    var mongoose = require('mongoose');
    var logWriter = require('../helpers/logWriter')();
    var async = require('async');
    var Layout = db.model(CONST.MODELS.LAYOUT);

    var ObjectId = mongoose.Types.ObjectId;


    this.updateLayoutByName = function (req, res, next) {
        var body = req.body;

        if (!body.layoutName || !body.layoutId) {
            return res.status(400).send({err: RESPONSE.NOT_ENOUGH_PARAMS });
        }

        var layout = new Layout(body);
       // console.log(body);

        layout
            .update({layoutName:layoutName}, function (err, layoutModel) {
                if (err) {
                    return next(err);
                }
                res.status(201).send(layoutModel);
            })
    };

    this.createLayout = function (req, res, next) {
        var body = req.body;

        if (!body.layoutName || !body.layoutId) {
            return res.status(400).send({err: RESPONSE.NOT_ENOUGH_PARAMS });
        }

        var layout = new Layout(body);
        //console.log(body);

        layout
            .save(function (err, layoutModel) {
                if (err) {
                    return next(err);
                }
                res.status(201).send(layoutModel);
            })
    };

    this.getLayoutByName = function (req, res, next) {
        var searchName = req.params.layoutName;

        if (!searchName) {
            return res.status(400).send({err: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        findLayoutByName(searchName, function (err, layout) {
            if (err) {
                return next(err);
            }
            return res.status(200).send(layout);
        })
    };

    function findLayoutByName(layoutName, callback) {
        Layout
            .findOne({layoutName: layoutName})
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