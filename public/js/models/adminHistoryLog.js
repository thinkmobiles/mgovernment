define([], function(){
    var adminHistoryLogModel = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot:  function(){
            return '/adminHistory/'
        }
    });
    return adminHistoryLogModel;
});

