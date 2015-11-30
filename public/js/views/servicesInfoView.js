define([
    'text!templates/servicesInfoViewTemplate.html',
    'collections/servicesInfo',
    'text!templates/pagination/paginationTemplate.html',
    'views/customElements/paginationView'
],function(content, ServicesInfoCollection, paginationTemplate, PaginationView){
    'use strict';

    var propertyList = '';
    var properties = '';
    var servicesInfoView = Backbone.View.extend({

        el: '#dataBlock',
        events: {
            'click .DbList': 'showServicesInfo',
            'click #updateServiceInfo': 'updateService'
        },

        template: _.template(content),

        initialize: function(options){
            this.servicesInfoCollection =  new ServicesInfoCollection();
            this.paginationView = new PaginationView({
                collection   : this.servicesInfoCollection,
                url          : 'servicesInfo',
                urlGetCount  : this.servicesInfoCollection.url + 'getCount',
                padding      : 2,
                ends         : true,
                steps        : true,
                data         : {}
            });

            this.listenTo(this.servicesInfoCollection, 'reset remove', this.render);
            //this.render();
        },

        updateService: function(e) {

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            if (!this.selectedServiceId) return;

            App.selectedService = this.servicesInfoCollection.models[this.selectedServiceId];
            Backbone.history.fragment = '';
            Backbone.history.navigate('updateServiceInfo', {trigger: true});
        },

        showServicesInfo: function(e){
            var id = $(e.currentTarget ).attr('data-hash');
            var selectedService = this.servicesInfoCollection.toJSON()[id];
            var str = "";
            var property;

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

            var servicesCollection = this.servicesInfoCollection.toJSON();
            var textContent;
            var serviceDiv;
            var serviceId;
            var service;

            console.log('updateServiceInfoList');

            for (var i = servicesCollection.length-1; i>=0; i--){
                service = servicesCollection[i];
                serviceId = service._id;
                serviceDiv = $("#DbList" + serviceId);
                textContent = '<td>' + service.profile.Name.EN + '</td>' +
                '<td>Static</td>';


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

            console.log('ServicesInfoView render');

            this.$el.html(this.template());
            this.$el.find("#paginationDiv").html(this.paginationView.render().$el);

            propertyList =  $("#propertyList");
            properties = $("#properties");

            this.updateServiceList();

            return this;
        }
    });

    return servicesInfoView;
});
