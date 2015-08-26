define([
    '../models/userHistoryLog'
], function(userHistoryLogModel){
    var userHistoryLogsCollection = Backbone.Collection.extend({
        model: userHistoryLogModel,
        url: '/userHistory/'
    });
    return userHistoryLogsCollection;
});