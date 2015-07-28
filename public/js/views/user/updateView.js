
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

        readPropertySelectedUser: function(){
            var el = this.$el;
            var user =  App.selectedUser.toJSON();
            console.log(user.forUserType);

            el.find('#serviceProvider').val(service.serviceProvider);
            el.find('#serviceName').val(service.serviceName);
            el.find('#serviceType').val(service.serviceType);
            el.find('#description').val(service.profile.description);
            el.find('#baseUrl').val(service.baseUrl);

            service.forUserType.indexOf('guest') >= 0 ? el.find('#guest')[0].checked = true : undefined;
            service.forUserType.indexOf('client') >= 0 ? el.find('#client')[0].checked = true : undefined;
            service.forUserType.indexOf('admin') >= 0 ? el.find('#admin')[0].checked = true : undefined;
            service.forUserType.indexOf('company') >= 0 ? el.find('#company')[0].checked = true : undefined;
            service.forUserType.indexOf('government') >= 0 ? el.find('#government')[0].checked = true : undefined;

            service.method == 'POST' ? el.find('#POST')[0].checked =true : el.find('#GET')[0].checked = true;
            el.find('#url').val(service.url);
            console.log(service.params.needUserAuth);
            service.params.needUserAuth ? el.find('#needUserAuth')[0].checked = true : el.find('#needUserAuth2')[0].checked = true;
        },

        updateUser: function(e){
            console.log('Update Button pressed');
            var el = this.$el;
            var model = new UserModel();
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
            console.log(user);

            this.$el.html(this.template(user));
           // this.readPropertySelectedUser();
            return this;
        }
    });

    return userUpdateView;
});