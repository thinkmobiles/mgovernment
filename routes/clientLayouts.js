
var express = require( 'express' );
var LayoutHandler = require('../handlers/clientLayouts');

module.exports = function(db){

    var router = express.Router();
    var layoutsHandler = new LayoutHandler(db);

    router.route('/:id')
        //.post(layoutsHandler.createLayoutByName)
        .get(layoutsHandler.getLayoutById);

    return router;
};