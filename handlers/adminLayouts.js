var CONST = require('../constants');
var RESPONSE = require('../constants/response');

var Layout = function(db) {

    var mongoose = require('mongoose');
    var logWriter = require('../helpers/logWriter')();
    var async = require('async');
    var Layout = db.model(CONST.MODELS.LAYOUT);

    var ObjectId = mongoose.Types.ObjectId;


    this.updateLayoutById = function (req, res, next) {
        var searchQuery = {
            '_id': req.params.id
        };
        var body = req.body;

        if (!body.layoutName || !body.layoutId || !body._id) {
            return res.status(400).send({err: RESPONSE.NOT_ENOUGH_PARAMS });
        }



        Layout
            .findOneAndUpdate(searchQuery,body, function (err, layoutModel) {
                if (err) {
                    return next(err);
                }
                res.status(202).send(layoutModel);
            });

    };

    this.createLayout = function (req, res, next) {
        var body = req.body;

        if (!body.layoutName || !body.layoutId ||!body._id) {
            return res.status(400).send({err: RESPONSE.NOT_ENOUGH_PARAMS });
        }

        var layout = new Layout(body);

        layout
            .save(function (err, layoutModel) {
                if (err) {
                    return next(err);
                }
                res.status(201).send(layoutModel);
            })
    };



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
            return res.status(200).send(layout.toJSON());
        })
    };

    this.getLayouts = function (req, res, next) {


        Layout
            .find({}, function (err, collection) {
                if (err) {
                    return next(err);
                }

                if (!collection) {
                    var err = new Error('Not found Layouts: ');
                    err.status = 404;
                    return next(err);
                }
                return res.status(200).send(collection);
            });
    };

    this.getItemByIdAndLayoutId = function (req, res, next) {
        var searchQuery = {
            '_id': req.params.id,
            'items.id': req.params.itemId
        };
        var responseItem = {};

        if (!searchQuery._id) {
            return res.status(400).send({err: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        findLayoutByQuery(searchQuery, function (err, layout) {
            if (err) {
                return next(err);
            }
            for (var i = layout.items.length-1; i>=0; i-- ){
                if(layout.items[i].id == req.params.itemId ){
                    responseItem.order = layout.items[i].order;
                    responseItem.name = layout.items[i].name;
                    responseItem.itemType = layout.items[i].itemType;
                    responseItem.dataSource = layout.items[i].dataSource;
                    responseItem.id = layout.items[i].id;
                    responseItem.action = layout.action;
                }
            }
            return res.status(200).send(responseItem);
        })
    };

    this.createItemByIdAndLayoutId = function (req, res, next) {
        var searchQuery = {
            '_id': req.params.id
            //'items.id': req.params.itemId
        };
        var data = req.body.items[0];

        //var responseItem = {};

        if (!searchQuery._id) {
            return res.status(400).send({err: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        findLayoutByQuery(searchQuery, function (err, layout) {
            if (err) {
                return next(err);
            }

            Layout
                .update(searchQuery, {$push: {'items': data}}, function (err, model) {
                    if (err) {
                        return next(err);
                    }
                    return res.status(201).send(model);
                });
        })
    };


    this.updateItemByIdAndLayoutId = function (req, res, next) {
        var searchQuery = {
            '_id': req.params.id,
            'items.id': req.params.itemId
        };
        var data = req.body.items[0];

        //var responseItem = {};

        if (!searchQuery._id || !searchQuery['items.id']) {
            return res.status(400).send({err: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        findLayoutByQuery(searchQuery, function (err, layout) {
            if (err) {
                return next(err);
            }

            Layout
                .update(searchQuery, {$set: {
                    'items.$': data}}, function (err,dataResponse) {
                    if (err) {
                        return res.status(400).send({ err: err});
                    }
                    return res.status(202).send(dataResponse);
                });
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
                return callback(null, model);
            });
    }

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