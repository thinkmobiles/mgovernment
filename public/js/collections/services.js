define([
    '../models/service'
], function(serviceModel){
    var ServicesCollection = Backbone.Collection.extend({
        model: serviceModel,
        url: '/adminService/'

    });
    return ServicesCollection;
});