
var express = require( 'express' );
var LayoutHandler = require('../handlers/adminLayouts');

module.exports = function(db){


    var router = express.Router();
    var layoutsHandler = new LayoutHandler(db);

    router.route('/:layoutName/:itemId')
        //.post(layoutsHandler.createTitleInLayout)
        //.put(layoutsHandler.updateLayout)
        .get(layoutsHandler.getItemByIdAndLayoutName);

    router.route('/:layoutName')
        .post(layoutsHandler.createLayoutByName)
        .put(layoutsHandler.updateLayoutByName)
        .get(layoutsHandler.getLayoutByName);

    return router;
};