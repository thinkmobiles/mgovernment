define([
    'text!templates/feedbacksViewTemplate.html',
    'collections/feedbacks',
    'text!templates/pagination/paginationTemplate.html',
    'views/customElements/paginationView'
],function(content, FeedbacksCollection, paginationTemplate, PaginationView){
    var feedbacksView = Backbone.View.extend({

        el: '#dataBlock',
        events: {
            'click .DbList': 'showFeedbackInfo',
            'click #createService': 'createService',
            'click #cloneService': 'cloneService',
            'click #deleteService': 'deleteService',
            'click #updateService': 'updateService'
        },

        template: _.template(content),

        initialize: function(options){
            this.feedbacksCollection =  new FeedbacksCollection();
            this.paginationView = new PaginationView({
                collection   : this.feedbacksCollection,
                countPerPage : options.countPerPage,
                url          : 'feedbacks',
                urlGetCount  : '/feedback/getCount',
                padding      : 2,
                page         : options.page,
                ends         : true,
                steps        : true,
                data         : {}
            });

            this.listenTo(this.feedbacksCollection, 'sync reset remove', this.render);
            this.render();
        },


        //createService: function(e){
        //    e.preventDefault();
        //    e.stopPropagation();
        //    e.stopImmediatePropagation();
        //    Backbone.history.fragment = '';
        //    Backbone.history.navigate('createService', {trigger: true});
        //},
        //
        //deleteService: function() {
        //    if (!this.selectedServiceId) {
        //        return;
        //    }
        //    var service = this.feedbacksCollection.models[this.selectedServiceId];
        //    var self = this;
        //
        //    service.destroy ({
        //        success: function(model, response, options){
        //            alert('Service deleted');
        //            self.FeedbacksCollection.reset();
        //        },
        //
        //        error: function(model, xhr, options){
        //            alert(xhr);
        //        }
        //    });
        //},

        //cloneService: function(e) {
        //
        //    e.preventDefault();
        //    e.stopPropagation();
        //    e.stopImmediatePropagation();
        //    console.log('clone service');
        //
        //    if (!this.selectedServiceId) return;
        //
        //    App.selectedFeedback = this.feedbacksCollection.models[this.selectedServiceId];
        //    Backbone.history.fragment = '';
        //    Backbone.history.navigate('cloneService', {trigger: true});
        //},
        //updateService: function(e) {
        //
        //    e.preventDefault();
        //    e.stopPropagation();
        //    e.stopImmediatePropagation();
        //
        //    if (!this.selectedServiceId) return;
        //
        //    App.selectedFeedback = this.feedbacksCollection.models[this.selectedServiceId];
        //    Backbone.history.fragment = '';
        //    Backbone.history.navigate('updateService', {trigger: true});
        //},


        showFeedbackInfo: function(e){
            var id = $(e.target).attr('data-hash');
            var selectedFeedback = this.feedbacksCollection.toJSON()[id];
            var str = "";
            var property;

            for(var k in selectedFeedback) {
                property = selectedFeedback[k];

                if (typeof property === 'object') {
                    property = JSON.stringify(property);
                }
                str += "<b>" + k + ": </b>" + property + "<br>";
            }

            this.selectedServiceId = id;

            $("#propertyList").text("").append(str);
            $("#properties").text( selectedFeedback.serviceName);

        },

        updateFeedbackList: function(){

            var FeedbacksCollection = this.feedbacksCollection.toJSON();
            var itemTextColor = '#0A0EF2';
            var textContent;
            var feedbackDiv;
            var feedbackId;
            var feedback;

            console.log('updateFeedbackList');

            for (var i = FeedbacksCollection.length-1; i>=0; i--){
                feedback = FeedbacksCollection[i];
                feedbackId = feedback._id;
                feedbackDiv = $("#DbList" + feedbackId);
                textContent = feedback.serviceName + ', ' + feedback.rate;

                if (!feedbackDiv.length) {
                    $("<div> </div>").
                        attr("id", "DbList" + feedbackId).
                        attr("class", "DbList").css({"color": itemTextColor}).
                        attr("data-hash", "" + i).
                        text(textContent).
                        appendTo("#databaseList");
                } else {
                    $("#DbList" + feedbackId).
                        attr("class", "DbList").css({"color": itemTextColor}).
                        attr("data-hash", "" + i).
                        text(textContent);
                }
            }

            return this;
        },

        render: function () {

            console.log('feedbacksView render');

            this.$el.html(this.template());
            this.$el.find("#paginationDiv").html(this.paginationView.render().$el);
            this.updateFeedbackList();
        }
    });

    return feedbacksView;
});
