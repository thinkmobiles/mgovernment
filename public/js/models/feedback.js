define([], function(){
    var feedbackModel = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot:  function(){
            return '/cms/feedback/'
        }
    });
    return feedbackModel;
});

