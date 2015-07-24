/**
 * Created by Roman on 28.05.2015.
 // */
define([
    'text!templates/mainViewTemplate.html',
    'views/topBarView',
    '../models/adminSignIn',
    '../models/adminSignOut'

], function (mainTemplate, topBarView, adminSignIn, adminSignOut) {
    var mainView = Backbone.View.extend({
        el: '#content',

        template: _.template(mainTemplate),

        events: {
            'mouseover .actionButton': 'changePointer',
            'mouseout .actionButton': 'clearDecoration',
            'mouseover .actionButtonWhite': 'changePointerWhite',
            'mouseout .actionButtonWhite': 'clearDecorationWhite',
            "click #signIn": "SignInAdmin",
            "click #signOut": "SignOutAdmin"
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

        clearDecorationWhite:function(e) {
            $(e.target).css({"background-color":"white"});
        },

        changePointerWhite: function(e) {
            $(e.target).css({"cursor":"pointer"});
            $(e.target).css({"background-color":"rgba(0, 0, 0, 0.1)"});
        },

        SignInAdmin: function(e) {
            var model = new adminSignIn();

            var loginData ={
                login: $('#inputLogin').val(),
                pass: $('#inputPassword').val()
            };

            model.save(loginData, {
                success: function(model, response) {

                    console.log(response);
                    $('#topBar').css('display', 'block');
                    $('#signInLogin').text(loginData.login);
                    $('#logOutBlock').css('display', 'block');
                    $('#loginBlock').css('display', 'none');

                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                },

                error: function(err, xhr, model, response) {

                    console.log('Error: ',xhr.responseText);
                    alert(xhr.responseText);
                }
            });
        },

        SignOutAdmin: function(e) {
            var model = new adminSignOut();

            model.save({}, {
                success: function(model, response) {

                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    Backbone.history.navigate('index', {trigger: true});
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
