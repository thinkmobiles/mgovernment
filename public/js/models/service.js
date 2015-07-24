/**
 * Created by Roman on 04.06.2015.
 */
define([], function(){
    var serviceModel = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot:  function(){
            return '/adminService/'
        }
    });
    return serviceModel;
});

//GET - fetch //
//POST  Model.save
//PUT model.save
//PATCH
//DELETE