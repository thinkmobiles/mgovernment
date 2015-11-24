define([], function(){
    var poorCoverageModel = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot:  function(){
            return '/cms/poorCoverage/'
        }
    });
    return poorCoverageModel;
});

