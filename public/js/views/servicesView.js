define([
    'text!templates/servicesViewTemplate.html',
    'collections/services',
    'text!templates/pagination/paginationTemplate.html',
    'views/customElements/paginationView'
],function(content, ServicesCollection, paginationTemplate, PaginationView){
    'use strict';

    var propertyList = '';
    var properties = '';
    var servicesView = Backbone.View.extend({

        el: '#dataBlock',
        events: {
            'click .DbList': 'showServicesInfo',
            'click #createService': 'createService',
            'click #cloneService': 'cloneService',
            'click #deleteService': 'deleteService',
            'click #updateService': 'updateService'
        },

        template: _.template(content),

        initialize: function(options){
            this.servicesCollection =  new ServicesCollection();
            this.paginationView = new PaginationView({
                collection   : this.servicesCollection,
                countPerPage : options.countPerPage,
                url          : 'services',
                urlGetCount  : this.servicesCollection.url + 'getCount',
                padding      : 2,
                page         : options.page,
                ends         : true,
                steps        : true,
                data         : {}
            });

            this.listenTo(this.servicesCollection, 'reset remove', this.render);
            //this.render();
        },

        createService: function(e){
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            Backbone.history.fragment = '';
            Backbone.history.navigate('createService', {trigger: true});
        },

        deleteService: function() {
            if (!this.selectedServiceId) {
                return;
            }

            var service = this.servicesCollection.models[this.selectedServiceId];
            var self = this;

            service.destroy ({
                success: function(model, response, options){
                    alert('Service deleted');
                    self.servicesCollection.reset();
                },

                error: function(model, xhr, options){
                    alert(xhr);
                }
            });
        },

        cloneService: function(e) {

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            if (!this.selectedServiceId) return;

            console.log('clone service');
            App.selectedService = this.servicesCollection.models[this.selectedServiceId];
            Backbone.history.fragment = '';
            Backbone.history.navigate('cloneService', {trigger: true});
        },

        updateService: function(e) {

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            if (!this.selectedServiceId) return;

            App.selectedService = this.servicesCollection.models[this.selectedServiceId];
            Backbone.history.fragment = '';
            Backbone.history.navigate('updateService', {trigger: true});
        },

        showServicesInfo: function(e){
            var id = $(e.currentTarget ).attr('data-hash');
            var selectedService = this.servicesCollection.toJSON()[id];
            var str = "";
            var property;

            $(e.currentTarget).parent().children().removeClass('DbListSelected');
            $(e.currentTarget).addClass('DbListSelected');

            for(var k in selectedService) {
                property = selectedService[k];

                if (typeof property === 'object') {
                    property = JSON.stringify(property);
                }
                str += "<b>" + k + ": </b>" + property + "<br>";
            }

            this.selectedServiceId = id;

            propertyList.text("").append(str);
            properties.text( selectedService.serviceName);
        },

        updateServiceList: function(){

            var servicesCollection = this.servicesCollection.toJSON();
            var textContent;
            var serviceDiv;
            var serviceId;
            var service;

            console.log('updateServiceList');

            for (var i = servicesCollection.length-1; i>=0; i--){
                service = servicesCollection[i];
                serviceId = service._id;
                serviceDiv = $("#DbList" + serviceId);
                textContent = '<td><img src ="/icon/' + service.icon + '/@3x" style="float:left;height: 70px; width: 70px"></td>' +
                    '<td>' + service.profile.Name.EN + '</td>' +
                    '<td>' + service.serviceProvider + '</td>';


                if (!serviceDiv.length) {
                    $("<tr> </tr>").
                        attr("id", "DbList" + serviceId).
                        attr("class", "DbList").
                        attr("data-hash", "" + i).
                        html(textContent).
                        appendTo("#databaseList");
                } else {
                    $("#DbList" + serviceId).
                        attr("class", "DbList").
                        attr("data-hash", "" + i).
                        html(textContent);
                }
            }
        },

        render: function () {

            console.log('ServicesView render');

            this.$el.html(this.template());
            this.$el.find("#paginationDiv").html(this.paginationView.render().$el);

            propertyList =  $("#propertyList");
            properties = $("#properties");

            this.updateServiceList();

            return this;
        }
    });

    return servicesView;
});
