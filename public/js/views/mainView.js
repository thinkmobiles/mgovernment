
define([
    'text!templates/mainViewTemplate.html',
    'views/topBarView',
    'models/adminSignOut'

], function (mainTemplate, topBarView, adminSignOut) {
    var mainView = Backbone.View.extend({
        el: '#content',

        template: _.template(mainTemplate),

        events: {
            'mouseover .actionButton': 'changePointer',
            'mouseout .actionButton': 'clearDecoration',
            'mouseover .actionButtonWhite': 'changePointerWhite',
            'mouseout .actionButtonWhite': 'clearDecorationWhite',
            "click #signOut": "SignOutAdmin"
        },

        initialize: function () {
           console.log('Main View Inicialize');
            this.render();
        },

        clearDecoration:function(e) {
            $(e.target).css({"background-color":"rgba(0, 0, 0, 0.1)"});
        },

        changePointer: function(e) {
            $(e.target).css({"cursor":"pointer"});
            $(e.target).css({"background-color":"rgba(0, 0, 0, 0.01)"});
        },

        clearDecorationWhite:function(e) {
            $(e.target).css({"background-color":"white"});
        },

        changePointerWhite: function(e) {
            $(e.target).css({"cursor":"pointer"});
            $(e.target).css({"background-color":"rgba(0, 0, 0, 0.1)"});
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

        render: function () {
            //console.log('Main View render');
            //console.log('hello', App.authorized);
            this.$el.html(this.template());
            new topBarView();
            return this;
        }
    });

    return mainView;
});
