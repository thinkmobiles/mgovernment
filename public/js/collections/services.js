define([
    '../models/service'
], function(serviceModel){
    var ServicesCollection = Backbone.Collection.extend({
        model: serviceModel,
        url: '/adminService/'
        //initialize: function(){
        //    this.fetch({
        //    context:this,
        //        reset: true
        //    });
        //},
    });
    return ServicesCollection;
});