define([
    'text!templates/feedbacksViewTemplate.html',
    'collections/feedbacks',
    'text!templates/pagination/paginationTemplate.html',
    'views/customElements/paginationView'
], function (content, FeedbacksCollection, paginationTemplate, PaginationView) {
    var feedbacksView = Backbone.View.extend({

        el: '#dataBlock',
        events: {
            'click .DbList': 'showFeedbackInfo',
            'click #createService': 'createService',
            'click #cloneService': 'cloneService',
            'click #deleteService': 'deleteService',
            'click #updateService': 'updateService',
            "click .oe_sortable": "goSort"
        },

        template: _.template(content),

        initialize: function (options) {
            this.feedbacksCollection = new FeedbacksCollection();
            this.paginationView = new PaginationView({
                collection: this.feedbacksCollection,
                countPerPage: options.countPerPage,
                url: 'feedbacks',
                urlGetCount: '/feedback/getCount',
                padding: 2,
                page: options.page,
                ends: true,
                steps: true,
                data: {
                    orderBy: options.orderBy,
                    order: options.order
                }
            });

            this.listenTo(this.feedbacksCollection, 'reset remove', this.render);
            this.render();
        },

        showFeedbackInfo: function (e) {
            var id = $(e.target).attr('data-hash');
            var selectedFeedback = this.feedbacksCollection.toJSON()[id];
            var str = "";
            var property;

            for (var k in selectedFeedback) {
                property = selectedFeedback[k];

                if (typeof property === 'object') {
                    property = JSON.stringify(property);
                }
                str += "<b>" + k + ": </b>" + property + "<br>";
            }

            this.selectedServiceId = id;

            $("#propertyList").text("").append(str);
            $("#properties").text(selectedFeedback.serviceName);

        },

        goSort: function (e) {
            var target$ = $(e.target);
            var previousOrderBy = this.paginationView.stateModel.toJSON().data.orderBy;
            var previousOrder = this.paginationView.stateModel.toJSON().data.order;

            var sortClass;

            var sortBy = target$.data('sort');
            var sortOrder = 1;

            if (previousOrderBy === sortBy) {
                sortOrder = previousOrder * -1;
            }

            sortClass = (sortOrder == -1) ? 'sortUp' : 'sortDn';

            switch (sortClass) {
                case "sortDn":
                {
                    target$.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                    target$.removeClass('sortDn').addClass('sortUp');
                }
                    break;
                case "sortUp":
                {
                    target$.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                    target$.removeClass('sortUp').addClass('sortDn');
                }
                    break;
            }
            this.paginationView.setData({orderBy: sortBy, order: sortOrder});
        },

        render: function () {

            console.log('feedbacksView render');
            if (this.feedbacksCollection.toJSON().length) {
                console.log('this.feedbacksCollection.toJSON() has items')
            }

            this.$el.html(this.template({collection: this.feedbacksCollection.toJSON()}));
            this.$el.find("#paginationDiv").html(this.paginationView.render().$el);
        }
    });

    return feedbacksView;
});
