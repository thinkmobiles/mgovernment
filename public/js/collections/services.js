define([
    '../models/service',
    'views/mainView'
], function(heroModel,mainView){
    var ServicesCollection = Backbone.Collection.extend({
        model: heroModel,
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