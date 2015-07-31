
define(['Backbone', 'router','communication', 'custom'], function(Backbone, Router, Communication, Custom){

    function init(){

        App.authorized = false;

        var router = new Router();
        Backbone.history.start({silent: true});

        //fragment = Backbone.history.fragment;
        //console.log(fragment);
        //console.log(window.location.hash);
        //Backbone.history.fragment = '';
        //if(!fragment ){
        //    Backbone.history.navigate('#index', {trigger: true, replace: true});
        //} else {
        //    Backbone.history.navigate('#' + fragment, {trigger: true});
        //}

        Communication.checkLogin(function(err, data){
            Custom.runApplication(err, data);
        });


    }

    return {
        init: init
    }
});