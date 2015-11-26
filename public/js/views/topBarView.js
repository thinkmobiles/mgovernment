define([
    'text!templates/topBarTemplate.html',
    'models/adminSignOut'
], function (topBarTemplate, adminSignOut) {
    'use strict';

    var topBarView = Backbone.View.extend({
        el: '#topBar',
        template: _.template(topBarTemplate),
        events: {
            "click #signOut": "SignOutAdmin",
            'click .topBarButton': 'navigateToByDataHash'

        },

        initialize: function () {
            this.render();
        },

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

        navigateToByDataHash: function(e) {
            var targetEl = $(e.target);
            var hash = targetEl.data('hash');

            e.preventDefault();
            e.stopPropagation();

            $(targetEl).parent().find('.active').removeClass('active');
            $(targetEl).addClass('active');

            Backbone.history.fragment = '';
            Backbone.history.navigate(hash, {trigger: true});
        },

        render: function () {
            this.$el.html(this.template());

            return this;
        }
    });

    return topBarView;
});