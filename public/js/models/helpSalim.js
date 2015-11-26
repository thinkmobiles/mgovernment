define([], function(){
    var helpSalimModel = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot:  function(){
            return '/cms/helpSalim/'
        }
    });
    return helpSalimModel;
});

