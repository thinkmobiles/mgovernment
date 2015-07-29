
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

            data.serviceProvider = el.find('#serviceProvider').val();
            data.serviceName = el.find('#serviceName').val();
            data.serviceType = el.find('#serviceType').val();
            data.profile = {
                description: el.find('#description').val()
            };
            data.baseUrl = el.find('#baseUrl').val();

            data.forUserType = [];
            el.find('#guest')[0].checked ? data.forUserType.push('guest') : undefined;
            el.find('#client')[0].checked ? data.forUserType.push('client') : undefined;
            el.find('#admin')[0].checked ? data.forUserType.push('admin') : undefined;
            el.find('#company')[0].checked ? data.forUserType.push('company') : undefined;
            el.find('#government')[0].checked ?  data.forUserType.push('government') : undefined;

            data.method = el.find('#POST')[0].checked ? 'POST' : 'GET';
            data.url = el.find('#url').val();
            data.params = {
                needUserAuth: el.find('#needUserAuth')[0].checked
            };
            //console.log(data);

            App.selectedUser.save(data, {
                success: function(model, response){
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('services', {trigger: true});
                    console.log('Success updated');
                    console.log(model);
                    console.log(response);
                    alert(model);

                },
                error: function(err, xhr, model, response){
                    console.log('Error created',xhr);
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