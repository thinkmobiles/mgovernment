define([
    '../models/icon'
], function(iconModel){
    var IconsCollection = Backbone.Collection.extend({
        model: iconModel,
        url: '/cms/icon/'
    });
    return IconsCollection;
});