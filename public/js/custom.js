define([],function () {
    var runApplication = function (err, data) {
        var url;

        url =  Backbone.history.fragment || Backbone.history.getFragment();

        if ((url === '')) {
            url = 'login';
        }

        if (Backbone.history.fragment) {
            Backbone.history.fragment = '';
        }

        if (!err) {
            App.authorized = true;
            return Backbone.history.navigate(url, {trigger: true});
        } else {
            App.authorized = false;
            return Backbone.history.navigate('login', {trigger: true});
        }
    };

    return {
        runApplication: runApplication
    };
});
