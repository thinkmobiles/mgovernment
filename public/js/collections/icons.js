define([
    '../models/icon'
], function(iconModel){
    var IconsCollection = Backbone.Collection.extend({
        model: iconModel,
        url: '/icon/'
    });
    return IconsCollection;
});