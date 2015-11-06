define([
    'Backbone',
    'views/mainView',
    'views/login/loginView',
    'views/service/createView',
    'views/service/updateView',
    'views/servicesView',
    'views/iconsView',
    'views/usersView',
    'views/user/createView',
    'views/user/updateView',
    'views/feedbacksView',
    'views/emailReportsView',
    'views/adminHistoryLogView',
    'views/userHistoryLogView'

], function (Backbone, MainView, LoginView, ServiceCreateView,ServiceUpdateView, ServicesView,IconsView, UsersView, UserCreateView, UserUpdateView, FeedbacksView, EmailReportsView, AdminHistoryLogView, UserHistoryLogView ) {

    var Router = Backbone.Router.extend({

        mainView: null,
        contentView: null,

        routes: {
            "index": "toMainView",
            "services(/p=:page)(/c=:countPerPage)": "toServicesView",
            "icon(/p=:page)(/c=:countPerPage)": "toIconsView",
            "feedbacks(/p=:page)(/c=:countPerPage)(/ob=:orderBy)(/o=:order)": "toFeedbacksView",
            "adminHistoryLog(/p=:page)(/c=:countPerPage)(/ob=:orderBy)(/o=:order)": "toAdminHistoryLogView",
            "userHistoryLog(/p=:page)(/c=:countPerPage)(/ob=:orderBy)(/o=:order)": "toUserHistoryLogView",
            "emailReports(/p=:page)(/c=:countPerPage)(/f=:filter)(/ob=:orderBy)(/o=:order)(/s=:searchTerm)": "toEmailReportsView",
            "login": "toLoginView",
            "createService": "toCreateServiceView",
            "updateService": "toUpdateServiceView",
            "cloneService": "toUpdateServiceViewWithCloneKey",
            "users(/p=:page)(/c=:countPerPage)(/s=:searchTerm)": "toUsersView",
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
            //this.contentView = new ServiceCreateView();
            this.contentView = new ServiceUpdateView({isNewService: true});
        },

        toUpdateServiceView: function () {

            if(this.contentView){
                this.contentView.undelegateEvents();
            }
            this.contentView = new ServiceUpdateView();
        },

        toUpdateServiceViewWithCloneKey: function () {

            if(this.contentView){
                this.contentView.undelegateEvents();
            }
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

        toIconsView: function (page, countPerPage) {
            page = parseInt(page) || 1;
            countPerPage = parseInt(countPerPage) || 10;

            if(this.contentView){
                this.contentView.undelegateEvents();
            }

            this.contentView = new IconsView({
                page: page,
                countPerPage: countPerPage
            });
        },

        toFeedbacksView: function (page, countPerPage, orderBy, order) {
            page = parseInt(page) || 1;
            countPerPage = parseInt(countPerPage) || 10;
            orderBy = orderBy || 'createdAt';
            order = order || 1;

            if(this.contentView){
                this.contentView.undelegateEvents();
            }

            this.contentView = new FeedbacksView({
                page: page,
                countPerPage: countPerPage,
                orderBy: orderBy,
                order: order
            });
        },

        toAdminHistoryLogView: function (page, countPerPage, orderBy, order) {
            page = parseInt(page) || 1;
            countPerPage = parseInt(countPerPage) || 10;
            orderBy = orderBy || 'createdAt';
            order = order || 1;

            if(this.contentView){
                this.contentView.undelegateEvents();
            }

            this.contentView = new AdminHistoryLogView({
                page: page,
                countPerPage: countPerPage,
                orderBy: orderBy,
                order: order
            });
        },

        toUserHistoryLogView: function (page, countPerPage, orderBy, order) {
            page = parseInt(page) || 1;
            countPerPage = parseInt(countPerPage) || 10;
            orderBy = orderBy || 'createdAt';
            order = order || 1;

            if(this.contentView){
                this.contentView.undelegateEvents();
            }

            this.contentView = new UserHistoryLogView({
                page: page,
                countPerPage: countPerPage,
                orderBy: orderBy,
                order: order
            });
        },

        toEmailReportsView: function (page, countPerPage, filter, orderBy, order, searchTerm) {
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
                order: order,
                searchTerm: searchTerm
            });
        },

        toUsersView: function (page, countPerPage, searchTerm) {
            page = parseInt(page) || 1;
            countPerPage = parseInt(countPerPage) || 10;

            if(this.contentView){
                this.contentView.undelegateEvents();
            }

            this.contentView = new UsersView({
                page: page,
                countPerPage: countPerPage,
                searchTerm: searchTerm
            });
        },

        toCreateUserView: function () {

            if(this.contentView){
                this.contentView.undelegateEvents();
            }
            this.contentView = new UserCreateView();
        },

        toUpdateUserView: function () {

            if(this.contentView){
                this.contentView.undelegateEvents();
            }
            this.contentView = new UserUpdateView();
        }
    });

    return Router;
});