define([], function(){
    var serviceModel = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot:  function(){
            return '/cms/adminService/'
        }
    });
    return serviceModel;
});

