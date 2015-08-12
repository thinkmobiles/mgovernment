define([], function(){
    var feedbackModel = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot:  function(){
            return '/feedback/'
        }
    });
    return feedbackModel;
});

