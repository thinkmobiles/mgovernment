
var express = require( 'express' );
var LayoutHandler = require('../handlers/adminLayouts');

module.exports = function(db){

    var router = express.Router();
    var layoutsHandler = new LayoutHandler(db);

    router.route('/')
        .post(layoutsHandler.createLayout)
        .get(layoutsHandler.getLayouts);

    router.route('/getCount/')
        .get(layoutsHandler.getCount);

    router.route('/:id/:itemId')
        .post(layoutsHandler.createItemByIdAndLayoutId)
        .put(layoutsHandler.updateItemByIdAndLayoutId)
        .get(layoutsHandler.getItemByIdAndLayoutId);

    router.route('/:id')
      //  .post(layoutsHandler.createLayoutByName)
        .put(layoutsHandler.updateLayoutById)
        .get(layoutsHandler.getLayoutById);

    return router;
};