define([
    'text!templates/feedbacksViewTemplate.html',
    'collections/feedbacks',
    'text!templates/pagination/paginationTemplate.html',
    'views/customElements/paginationView'
], function (content, FeedbacksCollection, paginationTemplate, PaginationView) {
    'use strict';

    var feedbacksView = Backbone.View.extend({

        el: '#dataBlock',
        events: {
            "click .oe_sortable": "goSort"
        },

        template: _.template(content),

        initialize: function (options) {
            this.feedbacksCollection = new FeedbacksCollection();
            this.paginationView = new PaginationView({
                collection: this.feedbacksCollection,
                countPerPage: options.countPerPage,
                url: 'feedbacks',
                urlGetCount: this.feedbacksCollection.url + 'getCount',
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
        },

        goSort: function (e) {
            var target$ = $(e.target);
            var previousOrderBy = this.paginationView.stateModel.toJSON().data.orderBy;
            var previousOrder = this.paginationView.stateModel.toJSON().data.order;
            var sortOrder = 1;
            var sortBy;

            if (target$[0].className !=='oe_sortable') {
                target$ = target$.parent();
            }

            sortBy = target$.data('sort');

            if (previousOrderBy === sortBy) {
                sortOrder = previousOrder * -1;
            }

            if (sortOrder == -1) {
                target$.find(".sortDN").show()
            } else {
                target$.find(".sortUP").show()
            }
            this.paginationView.setData({orderBy: sortBy, order: sortOrder});
        },

        render: function () {
            var el = this.$el;

            console.log('feedbacksView render');
            el.html(this.template({collection: this.feedbacksCollection.toJSON()}));
            el.find("#paginationDiv").html(this.paginationView.render().$el);
            this.paginationView.showOrderBy(el);

            return this;
        }
    });

    return feedbacksView;
});
