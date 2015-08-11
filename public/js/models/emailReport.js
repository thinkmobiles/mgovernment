define([], function(){
    var emailReportModel = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot:  function(){
            return '/emailReport/'
        }
    });
    return emailReportModel;
});

