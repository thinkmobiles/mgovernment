
var express = require( 'express' );
var LayoutHandler = require('../handlers/layouts');

module.exports = function(db){

    var router = express.Router();
    var layoutsHandler = new LayoutHandler(db);

    router.route('/')
        .post(layoutsHandler.createLayout)
        .get(layoutsHandler.getLayoutByName);

    return router;
};