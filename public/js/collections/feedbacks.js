define([
    '../models/feedback'
], function(feedbackModel){
    var FeedbacksCollection = Backbone.Collection.extend({
        model: feedbackModel,
        url: '/cms/feedback/'
    });
    return FeedbacksCollection;
});