
define([
    'text!templates/user/update.html',
    '../../models/user'


], function (content, UserModel) {
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
            console.log('Update Button pressed');
            var el = this.$el;
            var data ={};

            data.login = el.find('#login').val();
            data.pass = el.find('#pass').val();
            data.firstName = el.find('#firstName').val();
            data. lastName = el.find('#lastName').val();
            data.userType = el.find('#client')[0].checked ? 'client' :  el.find('#admin')[0].checked ? 'admin' :  el.find('#company')[0].checked ? 'company' :  el.find('#government')[0].checked ? 'government' : 'thi is impossible';

            //console.log(data);

            App.selectedUser.save(data, {
                success: function(model, response){
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('users', {trigger: true});
                    console.log('Success updated');
                    console.log(model);
                    console.log(response);
                    alert(model);

                },
                error: function(err, xhr, model, response){
                    console.log('Error updating',xhr);
                    alert(xhr.responseText);
                }
            });
        },

        render: function () {
            var user = App.selectedUser.toJSON();
            //console.log(user);

            this.$el.html(this.template(user));
            return this;
        }
    });

    return userUpdateView;
});