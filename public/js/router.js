
define([
    'Backbone',
    'views/mainView',
    'views/login/loginView',
    'views/service/createView',
    'views/service/updateView',
    'views/servicesView',
    'views/usersView',
    'views/user/createView',
    'views/user/updateView'

], function (Backbone, MainView, LoginView, ServiceCreateView,ServiceUpdateView, ServicesView, UsersView, UserCreateView, UserUpdateView) {
    var Router = Backbone.Router.extend({

        mainView: null,
        contentView: null,

        routes: {
            "index": "toMainView",
            "services(/p=:page)(/c=:countPerPage)": "toServicesView",
            "login": "toLoginView",
            "createService": "toCreateServiceView",
            "updateService": "toUpdateServiceView",
            "users(/p=:page)(/c=:countPerPage)": "toUsersView",
            "createUser": "toCreateUserView",
            "updateUser": "toUpdateUserView"
        },

        initialize: function () {

            this.mainView = new MainView();
        },


        toMainView: function () {
            if (this.mainView) {
                this.mainView.undelegateEvents();
            }
            //console.log('MainView routed');
            this.mainView = new MainView();

        },

        toLoginView: function () {
            if (this.mainView) {
                this.mainView.undelegateEvents();
            }

            this.mainView = new LoginView();

        },

        toCreateServiceView: function () {

            if(this.contentView){
                this.contentView.undelegateEvents();
            }

            this.contentView = new ServiceCreateView();
        },

        toUpdateServiceView: function () {

            if(this.contentView){
                this.contentView.undelegateEvents();
            }
            //console.log('updateServices clicked');
            this.contentView = new ServiceUpdateView();
        },

        toServicesView: function (page, countPerPage) {
            page = parseInt(page) || 1;
            countPerPage = parseInt(countPerPage) || 10;

            if(this.contentView){
                this.contentView.undelegateEvents();
            }

            this.contentView = new ServicesView({
                page: page,
                countPerPage: countPerPage
            });

        },

        toUsersView: function (page, countPerPage) {
            page = parseInt(page) || 1;
            countPerPage = parseInt(countPerPage) || 10;

            if(this.contentView){
                this.contentView.undelegateEvents();
            }

            this.contentView = new UsersView({
                page: page,
                countPerPage: countPerPage
            });
        },

        toCreateUserView: function () {

            if(this.contentView){
                this.contentView.undelegateEvents();
            }
            //console.log('createUser clicked');
            this.contentView = new UserCreateView();
        },

        toUpdateUserView: function () {

            if(this.contentView){
                this.contentView.undelegateEvents();
            }
            //console.log('updateSUser clicked');
            this.contentView = new UserUpdateView();
        }
    });

    return Router;
});