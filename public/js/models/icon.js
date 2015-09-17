define([], function(){
    var iconModel = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot:  function(){
            return '/icon/'
        }
    });
    return iconModel;
});

