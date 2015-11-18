define([
    '../models/user'
], function(userModel){
    var UsersCollection = Backbone.Collection.extend({
        model: userModel,
        url: '/cms/user/'
    });
    return UsersCollection;
});