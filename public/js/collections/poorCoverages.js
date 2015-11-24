define([
    '../models/poorCoverage'
], function(poorCoverageModel){
    var PoorCoverageCollection = Backbone.Collection.extend({
        model: poorCoverageModel,
        url: '/cms/poorCoverage/'
    });
    return PoorCoverageCollection;
});