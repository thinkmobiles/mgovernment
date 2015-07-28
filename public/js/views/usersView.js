define([
    'text!templates/usersViewTemplate.html',
    '../collections/users',
],function(content, UsersCollection){
    var usersView = Backbone.View.extend({

        el: '#dataBlock',
        events: {
            'click .DbList': 'showUsersInfo',
            'mouseover .DbList': 'changePointer',
            'mouseout .DbList': 'clearDecoration',
            'click #createUser': 'createUser',
            'click #deleteUser': 'deleteUser',
            'click #updateUser': 'updateUser'
        },

        template: _.template(content),

        initialize: function(){
            var self = this;

            this.UsersCollection =  new UsersCollection();
            this.UsersCollection.fetch({
                success: function(model){

                    console.log('Services loaded: ',  self.UsersCollection.toJSON());
                    self.render();
                },

                error: function(err, xhr, model){
                    alert(xhr);
                }
            });

        },

        render: function () {
            console.log('usersView render');
            this.$el.html(this.template());
            this.updateUserList();
        },

        clearDecoration:function(e) {
            $(e.target).css({"background-color":"white"});
        },

        changePointer: function(e){
            $(e.target).css({"cursor":"pointer"});
            $(e.target).css({"background-color":"#d3d3d3"});
        },

        createUser: function(e){
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            Backbone.history.navigate('createUser', {trigger: true});
        },

        deleteUser: function() {

            var service = this.UsersCollection.models[this.selectedUserId];

            service.destroy ({
                success: function(model, response, options){
                    alert('User deleted');
                    Backbone.history.navigate('users', {trigger: true});
                },

                error: function(model, xhr, options){
                    alert(xhr);
                }
            });
        },

        updateUser: function() {

            if (!this.selectedUserId) return;

            App.selectedUser = this.UsersCollection.models[this.selectedUserId];
            Backbone.history.navigate('updateUser', {trigger: true});
        },

        showUsersInfo: function(e){
            var id = $(e.target).attr('data-hash');
            var selectedUser = this.UsersCollection.toJSON()[id];
            var str = "";
            var property;

            for(var k in selectedUser) {
                property = selectedUser[k];

                if (typeof property == 'object') {
                    property = JSON.stringify(property);
                }
                str += "<b>" + k + ": </b>" + property + "<br>";
            }

            this.selectedUserId = id;

            $("#propertyList").text("");
            $("#propertyList").append(str);
            $("#properties").text( selectedUser.login + " properties ");
        },

        updateUserList: function(){

            var UsersCollection = this.UsersCollection.toJSON();
            var itemTextColor = '#0A0EF2';
            var textContent;
            var serviceDiv;
            var serviceId;
            var service;

            for (var i = UsersCollection.length-1; i>=0; i--){
                service = UsersCollection[i];
                serviceId = service._id;
                serviceDiv = $("#DbList" + serviceId);
                textContent = service.login;

                console.log('service: ',service.serviceName);
                console.dir("#DbList" + serviceId);
                console.dir(serviceDiv);

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
