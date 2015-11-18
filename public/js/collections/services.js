define([
    '../models/service'
], function(serviceModel){
    var ServicesCollection = Backbone.Collection.extend({
        model: serviceModel,
        url: '/cms/adminService/'
    });
    return ServicesCollection;
});