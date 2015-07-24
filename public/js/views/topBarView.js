/**
 * Created by Roman on 28.05.2015.
 */
define([
    'text!templates/topBarTemplate.html',
], function (topBarTemplate) {
    var topBarView = Backbone.View.extend({
        el: '#topBar',

        template: _.template(topBarTemplate),

        events: {
            'mouseover .topBarButton': 'changePointer',
            'mouseout .topBarButton': 'clearDecoration',
            'click #navigateServicesView': 'navigateToByDataHash',
            'click #navigateUsersView': 'navigateToByDataHash'
        },

        initialize: function () {
            this.render();
        },

        clearDecoration:function(e) {
            $(e.target).css({"background-color":"rgba(0, 0, 0, 0.1)"});
        },

        changePointer: function(e) {
            $(e.target).css({"cursor":"pointer"});
            $(e.target).css({"background-color":"rgba(0, 0, 0, 0.01)"});
        },

        navigateToByDataHash: function(e) {
            var targetEl = $(e.target);
            var hash = targetEl.data('hash');

            e.preventDefault();
            e.stopPropagation();

            Backbone.history.navigate(hash, {trigger: true});
        },

        render: function () {
            this.$el.html(this.template());
            return this;
        }
    });

    return topBarView;
});