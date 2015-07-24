define([
    '../models/user'
], function(userModel){
    var UsersCollection = Backbone.Collection.extend({
        model: userModel,
        url: '/user/'
    });
    return UsersCollection;
});