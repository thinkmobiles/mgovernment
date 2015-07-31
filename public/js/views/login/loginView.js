define([
    'text!templates/login/loginViewTemplate.html',
    '../../models/adminSignIn'

], function (loginTemplate, adminSignIn) {
    var loginView = Backbone.View.extend({
        el: '#content',

        template: _.template(loginTemplate),

        events: {
            'mouseover .actionButton': 'changePointer',
            'mouseout .actionButton': 'clearDecoration',
            "click #signIn": "SignInAdmin"
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

        SignInAdmin: function(e) {
            var model = new adminSignIn();

            var loginData ={
                login: $('#inputLogin').val(),
                pass: $('#inputPassword').val()
            };

            model.save(loginData, {
                success: function(model, response) {

                    console.log(response);
                    //e.preventDefault();
                    //e.stopPropagation();
                    //e.stopImmediatePropagation();
                    App.authorized = true;
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('index', {trigger: true, replace: true});
                },

                error: function(err, xhr, model, response) {

                    console.log('Error: ',xhr.responseText);
                    alert(xhr.responseText);
                }
            });
        },

        render: function () {
            this.$el.html(this.template());
            return this;
        }
    });

    return loginView;
});
