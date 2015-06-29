
var express = require( 'express' );
var LayoutHandler = require('../handlers/adminLayouts');

module.exports = function(db){


    var router = express.Router();
    var layoutsHandler = new LayoutHandler(db);

    router.route('/')
        .post(layoutsHandler.createLayout)
        .get(layoutsHandler.getLayouts);

    router.route('/:layoutName/:itemId')
        .post(layoutsHandler.createItemByIdAndLayoutName)
        .put(layoutsHandler.updateItemByIdAndLayoutName)
        .get(layoutsHandler.getItemByIdAndLayoutName);



    router.route('/:id')
      //  .post(layoutsHandler.createLayoutByName)
        .put(layoutsHandler.updateLayoutById)
        .get(layoutsHandler.getLayoutById);




    return router;
};