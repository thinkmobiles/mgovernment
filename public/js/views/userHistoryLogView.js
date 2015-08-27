define([
    'text!templates/userHistoryLogView.html',
    'collections/userHistoryLogs',
    'text!templates/pagination/paginationTemplate.html',
    'views/customElements/paginationView'
], function (content, userHistoryLogsCollection, paginationTemplate, PaginationView) {
    'use strict';

    var userHistoryLogView = Backbone.View.extend({

        el: '#dataBlock',
        events: {
              "click .oe_sortable": "goSort"
        },

        template: _.template(content),

        initialize: function (options) {
            this.userHistoryLogsCollection = new userHistoryLogsCollection();
            this.paginationView = new PaginationView({
                collection: this.userHistoryLogsCollection,
                countPerPage: options.countPerPage,
                url: 'userHistoryLog',
                urlGetCount: '/userHistory/getCount',
                padding: 2,
                page: options.page,
                ends: true,
                steps: true,
                data: {
                    orderBy: options.orderBy,
                    order: options.order
                }
            });

            this.listenTo(this.userHistoryLogsCollection, 'reset remove', this.render);
            this.render();
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

            console.log('userHistoryLogs render');
            if (this.userHistoryLogsCollection.toJSON().length) {
                console.log('this.feedbacksCollection.toJSON() has items')
            }

            this.$el.html(this.template({collection: this.userHistoryLogsCollection.toJSON()}));
            this.$el.find("#paginationDiv").html(this.paginationView.render().$el);

            return this;
        }
    });

    return userHistoryLogView;
});
