define([
    'Backbone',
    'views/mainView',
    'views/login/loginView',
    'views/service/createView',
    'views/service/updateView',
    'views/servicesView',
    'views/usersView',
    'views/user/createView',
    'views/user/updateView',
    'views/feedbacksView',
    'views/emailReportsView'

], function (Backbone, MainView, LoginView, ServiceCreateView,ServiceUpdateView, ServicesView, UsersView, UserCreateView, UserUpdateView, FeedbacksView, EmailReportsView  ) {
    var Router = Backbone.Router.extend({

        mainView: null,
        contentView: null,

        routes: {
            "index": "toMainView",
            "services(/p=:page)(/c=:countPerPage)": "toServicesView",
            "feedbacks(/p=:page)(/c=:countPerPage)": "toFeedbacksView",
            "emailReports(/p=:page)(/c=:countPerPage)(/f=:filter)(/ob=:orderBy)(/o=:order)": "toEmailReportsView",
            "login": "toLoginView",
            "createService": "toCreateServiceView",
            "updateService": "toUpdateServiceView",
            "cloneService": "toUpdateServiceViewWithCloneKey",
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
           console.log('updateServices clicked');
            this.contentView = new ServiceUpdateView();
        },

        toUpdateServiceViewWithCloneKey: function () {

            if(this.contentView){
                this.contentView.undelegateEvents();
            }
            //console.log('updateServices clicked');
            this.contentView = new ServiceUpdateView({cloneService: true});
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

        toFeedbacksView: function (page, countPerPage) {
            page = parseInt(page) || 1;
            countPerPage = parseInt(countPerPage) || 10;

            if(this.contentView){
                this.contentView.undelegateEvents();
            }

            this.contentView = new FeedbacksView({
                page: page,
                countPerPage: countPerPage
            });
        },

        toEmailReportsView: function (page, countPerPage, filter, orderBy, order) {

            page = parseInt(page) || 1;
            countPerPage = parseInt(countPerPage) || 10;
            filter = filter || '';
            orderBy = orderBy || 'createdAt';
            order = order || 1;


            if(this.contentView){
                this.contentView.undelegateEvents();
            }

            this.contentView = new EmailReportsView({
                page: page,
                countPerPage: countPerPage,
                filter: filter,
                orderBy: orderBy,
                order: order
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