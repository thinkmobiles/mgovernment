define([
    '../models/emailReport'
], function(emailReportModel){
    var  EmailReporsCollection = Backbone.Collection.extend({
        model: emailReportModel,
        url: '/cms/emailReport/'
    });
    return EmailReporsCollection;
});