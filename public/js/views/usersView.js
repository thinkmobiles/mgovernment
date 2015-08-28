define([
    'text!templates/usersViewTemplate.html',
    'collections/users',
    'text!templates/pagination/paginationTemplate.html',
    'views/customElements/paginationView'
],function(content, UsersCollection, paginationTemplate, PaginationView){
    'use strict';

    var propertyList = '';
    var properties = '';

    var usersView = Backbone.View.extend({

        el: '#dataBlock',
        events: {
            'click .DbList': 'showUsersInfo',
            'click #createUser': 'createUser',
            'click #deleteUser': 'deleteUser',
            'click #updateUser': 'updateUser',
            'keyup #searchTerm': 'searchByTerm'
        },

        template: _.template(content),

        initialize: function(options){
            this.usersCollection =  new UsersCollection();

            this.paginationView = new PaginationView({
                collection   : this.usersCollection,
                countPerPage : options.countPerPage,
                url          : 'users',
                urlGetCount  : '/user/getCount',
                padding      : 2,
                page         : options.page,
                ends         : true,
                steps        : true,
                data         : {
                    searchTerm: options.searchTerm
                }
            });

            if (!options.searchTerm) {
                App.searchTerm = '';
            }

            this.listenTo(this.usersCollection, 'reset remove', this.render);
            this.render();
        },

        searchByTerm: function(e){
            var searchTerm =  e.target.value;

            App.searchTerm = searchTerm;

            console.log('serchTerm:',searchTerm);
            this.paginationView.setData({searchTerm: searchTerm});
        },

        render: function () {
            console.log('usersView render');
            this.$el.html(this.template());
            this.$el.find("#paginationDiv").html(this.paginationView.render().$el);

            propertyList =  $("#propertyList");
            properties = $("#properties");

            this.updateUserList();

            return this;
        },

        createUser: function(e){
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            Backbone.history.navigate('createUser', {trigger: true});
        },

        deleteUser: function() {
            if (!this.selectedUserId) {
                return;
            }

            var user = this.usersCollection.models[this.selectedUserId];
            var self = this;

            user.destroy ({
                success: function(model, response, options){
                    alert('User deleted');
                    self.usersCollection.reset();
                },

                error: function(model, xhr, options){
                    alert(xhr);
                }
            });
        },

        updateUser: function(e) {

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            if (!this.selectedUserId) return;

            App.selectedUser = this.usersCollection.models[this.selectedUserId];
            Backbone.history.navigate('updateUser', {trigger: true});
        },

        showUsersInfo: function(e){
            var id = $(e.target).attr('data-hash');
            var selectedUser = this.usersCollection.toJSON()[id];
            var str = "";
            var property;

            for(var k in selectedUser) {
                property = selectedUser[k];

                if (typeof property === 'object') {
                    property = JSON.stringify(property);
                }
                str += "<b>" + k + ": </b>" + property + "<br>";
            }

            this.selectedUserId = id;

            propertyList.text("").append(str);
            properties.text( selectedUser.login );

        },

        updateUserList: function(){

            var usersCollection = this.usersCollection.toJSON();
            var itemTextColor = '#0A0EF2';
            var textContent;
            var serviceDiv;
            var serviceId;
            var service;

            $("#searchTerm").val(App.searchTerm ? App.searchTerm:'').focus();

            for (var i = usersCollection.length-1; i>=0; i--){
                service = usersCollection[i];
                serviceId = service._id;
                serviceDiv = $("#DbList" + serviceId);
                textContent = service.login;

                if (!serviceDiv.length) {
                    $("<div> </div>").
                        attr("id", "DbList" + serviceId).
                        attr("class", "DbList").css({"color": itemTextColor}).
                        attr("data-hash", "" + i).
                        text(textContent).
                        appendTo("#databaseList");
                } else {
                    $("#DbList" + serviceId).
                        attr("class", "DbList").css({"color": itemTextColor}).
                        attr("data-hash", "" + i).
                        text(textContent);
                }
            }
        }
    });

    return usersView;
});
