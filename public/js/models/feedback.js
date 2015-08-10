/**
 * Created by Roman on 04.06.2015.
 */
define([], function(){
    var feedbackModel = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot:  function(){
            return '/feedback/'
        }
    });
    return feedbackModel;
});

