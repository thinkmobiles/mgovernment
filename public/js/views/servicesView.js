define([
    'text!templates/servicesViewTemplate.html',
    'collections/services',
    'text!templates/pagination/paginationTemplate.html',
    'views/customElements/paginationView'
],function(content, ServicesCollection, paginationTemplate, PaginationView){
    var servicesView = Backbone.View.extend({

        el: '#dataBlock',
        events: {
            'click .DbList': 'showServicesInfo',
            'mouseover .DbList': 'changePointer',
            'mouseout .DbList': 'clearDecoration',
            'click #createService': 'createService',
            'click #deleteService': 'deleteService',
            'click #updateService': 'updateService'
        },

        template: _.template(content),

        initialize: function(){
            var self = this;

            this.servicesCollection =  new ServicesCollection();
            this.listenTo(this.servicesCollection, 'sync remove', this.render);

            console.log('servicesCollection', this.servicesCollection);

            this.paginationView = new PaginationView({
                collection   : this.servicesCollection,
                onPage       : 10,
                padding      : 2,
                page         : 1,
                ends         : true,
                steps        : true,
                data         : {status : "Hello"}
            });

            //this.servicesCollection.fetch({ data: {page: 1, count: 20 },

            //this.servicesCollection.fetch({
            //    success: function(model){
            //        console.log('Services loaded: ', self.servicesCollection.toJSON());
            //        self.render();
            //    },
            //
            //    error: function(err, xhr, model){
            //        alert(xhr);
            //    }
            //});
            this.render();
        },

        clearDecoration:function(e) {
            $(e.target).css({"background-color":"white"});
        },

        changePointer: function(e){
            $(e.target).css({"cursor":"pointer"});
            $(e.target).css({"background-color":"#d3d3d3"});
        },

        createService: function(e){
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            Backbone.history.fragment = '';
            Backbone.history.navigate('createService', {trigger: true});
        },

        deleteService: function() {

            var service = this.servicesCollection.models[this.selectedServiceId];

            service.destroy ({
                success: function(model, response, options){
                    alert('Service deleted');
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('services', {trigger: true});
                },

                error: function(model, xhr, options){
                    alert(xhr);
                }
            });
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
            var id = $(e.target).attr('data-hash');
            var selectedService = this.servicesCollection.toJSON()[id];
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

            $("#propertyList").text("").append(str);
            $("#properties").text( selectedService.serviceName);
            //$("#properties").text( selectedService.serviceName + " properties ");
        },

        updateServiceList: function(){

            var servicesCollection = this.servicesCollection.toJSON();
            var itemTextColor = '#0A0EF2';
            var textContent;
            var serviceDiv;
            var serviceId;
            var service;

            console.log('updateServiceList');

            for (var i = servicesCollection.length-1; i>=0; i--){
                service = servicesCollection[i];
                serviceId = service._id;
                serviceDiv = $("#DbList" + serviceId);
                textContent = service.serviceProvider + ', ' + service.serviceName;

                //console.log('service: ',service.serviceName);
                //console.dir("#DbList" + serviceId);
                //console.dir(serviceDiv);

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
        },

        render: function () {

            console.log('ServicesView render');
            console.log(this.paginationView);

            this.$el.html(this.template());

            //this.$el.find("#paginationDiv").html(this.paginationView.$el);
            this.$el.find("#paginationDiv").html(this.paginationView.render().$el);
            //this.$el.find('#pagination').append();
            //this.$el.append(this.paginationView.$el);

            //this.$el.find("#paginationDiv").html(_.template(paginationTemplate)({gridStart: 1, gridEnd: 20, gridCount: 100 }));

            this.updateServiceList();
        }
    });

    return servicesView;
});
