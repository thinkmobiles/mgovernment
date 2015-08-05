define([], function(){

    var AdminSignOut = Backbone.Model.extend({
        urlRoot: '/user/signOut/'
    });

    return AdminSignOut;
});