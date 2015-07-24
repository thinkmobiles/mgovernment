
define([
    'Backbone',
    'views/mainView',
    'views/service/createView',
    'views/service/updateView',
    'views/servicesView',
    'views/usersView'


], function (Backbone, MainView,ServiceCreateView,ServiceUpdateView, ServicesView, UsersView) {
    var Router = Backbone.Router.extend({

        mainView: null,
        contentView: null,

        routes: {
            "index": "toMainView",
            "services": "toServicesView",
            "createService": "toCreateServiceView",
            "updateService": "toUpdateServiceView",
            "users": "toUsersView"

        },

        toMainView: function () {
            if (this.mainView) {
                this.mainView.undelegateEvents();
            }

            this.mainView = new MainView();

        },

        toCreateServiceView: function () {

            if(this.contentView){
                this.contentView.undelegateEvents();
            }
            console.log('createService clicked');
            this.contentView = new ServiceCreateView();
        },

        toUpdateServiceView: function () {

            if(this.contentView){
                this.contentView.undelegateEvents();
            }
            console.log('updateServices clicked');
            this.contentView = new ServiceUpdateView();
        },

        toServicesView: function () {
            if(this.contentView){
                this.contentView.undelegateEvents();
            }
            console.log('Services clicked');
            this.contentView = new ServicesView();
        },

        toUsersView: function () {
            if(this.contentView){
                this.contentView.undelegateEvents();
            }
            console.log('Users clicked');
            this.contentView = new UsersView();
        }
    });
//
    return Router;
});