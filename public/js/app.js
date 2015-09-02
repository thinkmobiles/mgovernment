define(['Backbone', 'router','communication', 'custom'], function(Backbone, Router, Communication, Custom){

    function init(){
        var router = new Router();

        App.authorized = false;
        Backbone.history.start({silent: true});

        Communication.checkLogin(function(err, data){
            Custom.runApplication(err, data);
        });
    }

    return {
        init: init
    }
});