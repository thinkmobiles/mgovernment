define([
    '../models/serviceInfo'
], function(serviceInfoModel) {
    var ServiceInfoCollection = Backbone.Collection.extend({
        model: serviceInfoModel,
        url: '/cms/staticServicesInfo/'
    });

    return ServiceInfoCollection;
});