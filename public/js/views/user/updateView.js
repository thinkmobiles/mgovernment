define([
    'text!templates/user/update.html',
    'validation'

], function (content, Validation) {
    var userUpdateView = Backbone.View.extend({
        el: '#dataBlock',
        template: _.template(content),

        events: {
            'click #updateBtn' : 'updateUser'
        },

        initialize: function () {
            console.log('updateView initialize');
            this.render();
        },

        updateUser: function(e){
            var el = this.$el;
            var errors = [];
            var data ={};

            data.login = el.find('#login').val().trim();
            data.pass = el.find('#pass').val().trim();
            data.gender = el.find('#gender')[0].checked ? 'male' : 'female';
            data.phone = el.find('#phone').val().trim();
            data.email = el.find('#email').val().trim();
            data.firstName = el.find('#firstName').val().trim();
            data.lastName = el.find('#lastName').val().trim();
            data.userType = el.find('#client')[0].checked ? 'client' :  el.find('#admin')[0].checked ? 'admin' :  el.find('#company')[0].checked ? 'company' :  el.find('#government')[0].checked ? 'government' : 'thi is impossible';

            Validation.checkLoginField(errors, true, data.login, 'Login');
            Validation.checkPasswordField(errors, true,  data.pass, 'Password');
            Validation.checkEmailField(errors, false,  data.email, 'Email');

            if (errors.length){
                alert(errors);
                return;
            }

            App.selectedUser.save(data, {
                success: function(model, response){
                    Backbone.history.history.back();
                },
                error: function(err, xhr, model, response){
                    console.log('Error updating',xhr);
                    alert(xhr.responseText);
                }
            });
        },

        render: function () {
            var user = App.selectedUser.toJSON();

            this.$el.html(this.template({user: user}));
            return this;
        }
    });

    return userUpdateView;
});