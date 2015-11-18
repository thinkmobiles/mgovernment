define([
    '../models/adminHistoryLog'
], function(adminHistoryLogModel){
    var adminHistoryLogsCollection = Backbone.Collection.extend({
        model: adminHistoryLogModel,
        url: '/cms/adminHistory/'
    });
    return adminHistoryLogsCollection;
});