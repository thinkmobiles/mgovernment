define([], function() {

    var csv = Backbone.Model.extend({
        urlRoot: '/cms/'
        });

    return csv;
});