
var express = require( 'express' );
var LayoutHandler = require('../handlers/adminLayouts');

module.exports = function(db){


    var router = express.Router();
    var layoutsHandler = new LayoutHandler(db);

    router.route('/:layoutName/:titleId')
        //.post(layoutsHandler.createTitleInLayaut)
        //.put(layoutsHandler.updateLayout)
        .get(layoutsHandler.getLayoutByName);

    router.route('/:layoutName')
        .post(layoutsHandler.createLayout)
        .put(layoutsHandler.updateLayoutByName)
        .get(layoutsHandler.getLayoutByName);

    return router;
};