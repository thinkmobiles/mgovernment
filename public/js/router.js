
define([
    'Backbone',
    'views/mainView',
    'views/service/createView',
    'views/service/updateView',
    'views/servicesView'


], function (Backbone, mainView,serviceCreateView,serviceUpdateView, servicesView) {
    var Router = Backbone.Router.extend({

        mainView: null,
        contentView: null,

        routes: {
            "index": "toMainView",
            "services": "toServicesView",
            "createService": "toCreateServiceView",
            "updateService": "toUpdateServiceView",

            "changeProperties": "changeProperties",
            "showDatabase": "showDatabase"

        },

        toMainView: function () {
            if (this.mainView) {
                this.mainView.undelegateEvents();
            }

            this.mainView = new mainView();

        },

        toCreateServiceView: function () {

            if(this.contentView){
                this.contentView.undelegateEvents();
            }
            console.log('createService clicked');
            this.contentView = new serviceCreateView();
        },

        toUpdateServiceView: function () {

            if(this.contentView){
                this.contentView.undelegateEvents();
            }
            console.log('updateProperties clicked');
            this.contentView = new serviceUpdateView();
        },

        toServicesView: function () {
            if(this.contentView){
                this.contentView.undelegateEvents();
            }
            console.log('Services clicked');
            this.contentView = new servicesView();
        }
    });
//
    return Router;
});