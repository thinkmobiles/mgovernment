define([
    'text!templates/usersViewTemplate.html',
    'collections/users',
    'text!templates/pagination/paginationTemplate.html',
    'views/customElements/paginationView'
],function(content, UsersCollection, paginationTemplate, PaginationView){
    var usersView = Backbone.View.extend({

        el: '#dataBlock',
        events: {
            'click .DbList': 'showUsersInfo',
            'click #createUser': 'createUser',
            'click #deleteUser': 'deleteUser',
            'click #updateUser': 'updateUser'
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
                data         : {}
            });

            this.listenTo(this.usersCollection, 'sync reset remove', this.render);
            this.render();
        },

        render: function () {
            console.log('usersView render');
            this.$el.html(this.template());
            this.$el.find("#paginationDiv").html(this.paginationView.render().$el);
            this.updateUserList();
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

            var service = this.usersCollection.models[this.selectedUserId];
            var self = this;

            service.destroy ({
                success: function(model, response, options){
                    alert('User deleted');
                    self.usersCollection.reset();
                    //Backbone.history.navigate('users', {trigger: true});
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

            $("#propertyList").text("").append(str);
            $("#properties").text( selectedUser.login );
            //$("#properties").text( selectedUser.login + " properties ");
        },

        updateUserList: function(){

            var usersCollection = this.usersCollection.toJSON();
            var itemTextColor = '#0A0EF2';
            var textContent;
            var serviceDiv;
            var serviceId;
            var service;

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

            return this;
        }
    });

    return usersView;
});
