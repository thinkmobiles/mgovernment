define([
    'text!templates/topBarTemplate.html',
], function (topBarTemplate) {
    var topBarView = Backbone.View.extend({
        el: '#topBar',

        template: _.template(topBarTemplate),

        events: {
            'click #navigateServicesView': 'navigateToByDataHash',
            'click #navigateUsersView': 'navigateToByDataHash',
            'click #navigateFeedbacksView': 'navigateToByDataHash',
        },

        initialize: function () {
            this.render();
        },

        navigateToByDataHash: function(e) {
            var targetEl = $(e.target);
            var hash = targetEl.data('hash');

            e.preventDefault();
            e.stopPropagation();
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