var CONST = require('../constants');
var RESPONSE = require('../constants/response');
var HistoryHandler = require('./historyLog');

var Layout = function(db) {

    var mongoose = require('mongoose');
    var logWriter = require('../helpers/logWriter')();
    var Layout = db.model(CONST.MODELS.LAYOUT);
    var historyHandler = new HistoryHandler(db);
  
    this.updateLayoutById = function (req, res, next) {
        var searchQuery = {
            '_id': req.params.id
        };

        var body = req.body;
        body.updatedAt = new Date();

        if (!body.layoutName || !body.layoutId || !body._id) {
            return res.status(400).send({err: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        Layout
            .findOneAndUpdate(searchQuery, body, function (err, layoutModel) {
                if (err) {
                    return next(err);
                }
                var log = {
                    userId: req.session.uId,
                    action: CONST.ACTION.UPDATE,
                    model: CONST.MODELS.LAYOUT,
                    modelId: searchQuery._id,
                    description: 'Update Layout by _id'
                };
                historyHandler.pushlog(log);
                res.status(202).send(layoutModel);
            });
    };

    this.createLayout = function (req, res, next) {
        var body = req.body;
        body.updatedAt = new Date();

        if (!body.layoutName || !body.layoutId || !body._id) {
            return res.status(400).send({err: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        var layout = new Layout(body);

        layout
            .save(function (err, layoutModel) {
                if (err) {
                    return next(err);
                }
                var log = {
                    userId: req.session.uId,
                    action: CONST.ACTION.CREATE,
                    model: CONST.MODELS.LAYOUT,
                    modelId: layoutModel._id,
                    description: 'Create new Layout'
                };
                historyHandler.pushlog(log);
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
        var updatedAt = new Date();
        var data = req.body.items[0];

        //var responseItem = {};

        if (!searchQuery._id) {
            return res.status(400).send({err: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        findLayoutByQuery(searchQuery, function (err, layoutModel) {
            if (err) {
                return next(err);
            }

            layoutModel
                .update(searchQuery, {$push: {'items': data}, $set: {updatedAt: updatedAt}}, function (err, model) {
                    if (err) {
                        return next(err);
                    }

                    var log = {
                        userId: req.session.uId,
                        action: CONST.ACTION.CREATE,
                        model: CONST.MODELS.LAYOUT,
                        modelId: searchQuery._id,
                        description:'Create new Item'
                    };

                    historyHandler.pushlog(log);

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
        var updatedAt = new Date();

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
                    'items.$': data}, $set:{ updatedAt: updatedAt}}, function (err,dataResponse) {
                    if (err) {
                        return res.status(400).send({ err: err});
                    }

                    var log = {
                        userId: req.session.uId,
                        action: CONST.ACTION.UPDATE,
                        model: CONST.MODELS.LAYOUT,
                        modelId: searchQuery._id,
                        description:'Update Item with id: ' +  searchQuery['items.id']
                    };

                    historyHandler.pushlog(log);

                    return res.status(202).send(dataResponse);
                });
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
                    var err = new Error(RESPONSE.ON_ACTION.NOT_FOUND + Query);
                    err.status = 404;
                    return callback(err);
                }
                return callback(null, model);
            });
    }
};

module.exports = Layout;