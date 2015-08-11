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

        updateFeedbackList: function() {
        },

        render: function () {

            console.log('feedbacksView render');
            if (this.feedbacksCollection.toJSON().length) {
                console.log('this.feedbacksCollection.toJSON() has items')
            }

            this.$el.html(this.template({collection: this.feedbacksCollection.toJSON()}));
            this.$el.find("#paginationDiv").html(this.paginationView.render().$el);
            this.updateFeedbackList();
        }
    });

    return feedbacksView;
});
