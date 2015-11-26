define([
    'text!templates/mainViewTemplate.html',
    'views/topBarView',
    'models/adminSignOut'

], function (mainTemplate, topBarView, adminSignOut) {
    'use strict';

    var mainView = Backbone.View.extend({
        el: '#content',

        template: _.template(mainTemplate),

        events: {
                  "click #signOut": "SignOutAdmin"
        },

        initialize: function () {
           console.log('Main View Initialized');
            this.render();
        },
        //TODO LogOut - перенесено на топ бар Вієв. переробити логіку

        SignOutAdmin: function(e) {
            var model = new adminSignOut();

            model.save({}, {
                success: function(model, response) {

                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    App.authorized = false;

                    Backbone.history.fragment = '';
                    Backbone.history.navigate('login', {trigger: true});
                },

                error: function(err, xhr, model, response) {

                    console.log('Error: ',xhr.responseText);
                    alert(xhr.responseText);
                }
            });
        },

        render: function () {

            this.$el.html(this.template());
            new topBarView();

            return this;
        }
    });

    return mainView;
});
