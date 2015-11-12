define([
    'text!templates/login/loginViewTemplate.html',
    '../../models/adminSignIn',
    'validation'

], function (loginTemplate, adminSignIn, Validation) {
    var loginView = Backbone.View.extend({
        el: '#content',

        template: _.template(loginTemplate),

        events: {
            "click #signIn": "SignInAdmin"
        },

        initialize: function () {
            this.render();
        },

        SignInAdmin: function(e) {
            var model = new adminSignIn();
            var errors = [];

            var loginData ={
                login: $('#inputLogin').val(),
                pass: $('#inputPassword').val()
            };

            Validation.checkLoginField(errors, true, loginData.login, 'Login');
            Validation.checkPasswordField(errors, true,  loginData.pass, 'Password');

            if (errors.length){
                alert(errors);
                return;
            }

            model.save(loginData, {
                success: function(model, response) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    //TODO dell class from body
                    $('body').removeClass('loginForm');

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
            //TODO add class to body
            $('body').addClass('loginForm');

            this.$el.html(this.template());
            return this;
        }
    });

    return loginView;
});
