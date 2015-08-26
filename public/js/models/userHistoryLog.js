define([], function(){
    var userHistoryLogModel = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot:  function(){
            return '/userHistory/'
        }
    });
    return userHistoryLogModel;
});

