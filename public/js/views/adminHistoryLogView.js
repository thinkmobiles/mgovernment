define([
    'text!templates/adminHistoryLogView.html',
    'collections/adminHistoryLogs',
    'text!templates/pagination/paginationTemplate.html',
    'views/customElements/paginationView'
], function (content, AdminHistoryLogsCollection, paginationTemplate, PaginationView) {
    var adminHistoryLogView = Backbone.View.extend({

        el: '#dataBlock',
        events: {
            'click .DbList': 'showFeedbackInfo',
             "click .oe_sortable": "goSort"
        },

        template: _.template(content),

        initialize: function (options) {
            this.adminHistoryLogsCollection = new AdminHistoryLogsCollection();
            this.paginationView = new PaginationView({
                collection: this.adminHistoryLogsCollection,
                countPerPage: options.countPerPage,
                url: 'adminHistoryLog',
                urlGetCount: '/adminHistory/getCount',
                padding: 2,
                page: options.page,
                ends: true,
                steps: true,
                data: {
                    orderBy: options.orderBy,
                    order: options.order
                }
            });

            this.listenTo(this.adminHistoryLogsCollection, 'reset remove', this.render);
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

            console.log('adminHistoryLogs render');
            if (this.adminHistoryLogsCollection.toJSON().length) {
                console.log('this.feedbacksCollection.toJSON() has items')
            }

            this.$el.html(this.template({collection: this.adminHistoryLogsCollection.toJSON()}));
            this.$el.find("#paginationDiv").html(this.paginationView.render().$el);
        }
    });

    return adminHistoryLogView;
});
