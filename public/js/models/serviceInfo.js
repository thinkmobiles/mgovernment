define([], function (){
    var serviceInfo = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot: '/cms/staticServicesInfo/'
    });

    return serviceInfo;
});
