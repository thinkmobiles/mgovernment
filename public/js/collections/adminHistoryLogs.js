define([
    '../models/adminHistoryLog'
], function(adminHistoryLogModel){
    var adminHistoryLogsCollection = Backbone.Collection.extend({
        model: adminHistoryLogModel,
        url: '/adminHistory/'
    });
    return adminHistoryLogsCollection;
});