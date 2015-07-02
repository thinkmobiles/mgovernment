
var express = require( 'express' );
var ServicesHandler = require('../handlers/adminServices');

module.exports = function(db){

    var router = express.Router();
    var servicesHandler = new ServicesHandler(db);

    router.route('/')
        .post(servicesHandler.createService)
        .get(servicesHandler.getServices);
    //
    //router.route('/getCount/')
    //    .get(servicesHandler.getCount);
    //
    //router.route('/:id/:itemId')
    //    .post(servicesHandler.createItemByIdAndLayoutId)
    //    .put(servicesHandler.updateItemByIdAndLayoutId)
    //    .get(servicesHandler.getItemByIdAndLayoutId);
    //
    router.route('/:id')
    //  //  .post(servicesHandler.createLayoutByName)
        .put(servicesHandler.updateServiceById)
        .get(servicesHandler.getLayoutById);

    return router;
};