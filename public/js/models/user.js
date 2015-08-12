define([], function(){
    var userModel = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot:  function(){
            return '/user/'
        }
    });
    return userModel;
});

//GET - fetch //
//POST  Model.save
//PUT model.save
//PATCH
//DELETE