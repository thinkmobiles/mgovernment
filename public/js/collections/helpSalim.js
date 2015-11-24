define([
    '../models/helpSalim'
], function(helpSalimModel){
    var HelpSalimCollection = Backbone.Collection.extend({
        model: helpSalimModel,
        url: '/cms/helpSalim/'
    });
    return HelpSalimCollection;
});