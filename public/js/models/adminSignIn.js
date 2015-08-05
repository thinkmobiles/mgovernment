define([], function(){

    var AdminSignIn = Backbone.Model.extend({
        urlRoot: '/user/adminSignIn/'
    });

    return AdminSignIn;
});