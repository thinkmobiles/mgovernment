define([
    '../models/emailReport'
], function(emailReportModel){
    var  EmailReporsCollection = Backbone.Collection.extend({
        model: emailReportModel,
        url: '/emailReport/'
    });
    return EmailReporsCollection;
});