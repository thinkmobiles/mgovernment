define([], function(){
    var emailReportModel = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot:  function(){
            return '/cms/emailReport/'
        }
    });
    return emailReportModel;
});

