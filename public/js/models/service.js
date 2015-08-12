define([], function(){
    var serviceModel = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot:  function(){
            return '/adminService/'
        }
    });
    return serviceModel;
});

