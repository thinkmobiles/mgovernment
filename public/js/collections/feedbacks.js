define([
    '../models/feedback'
], function(feedbackModel){
    var FeedbacksCollection = Backbone.Collection.extend({
        model: feedbackModel,
        url: '/feedback/'
    });
    return FeedbacksCollection;
});