define([
    'text!templates/adminHistoryLogView.html',
    'collections/adminHistoryLogs',
    'text!templates/pagination/paginationTemplate.html',
    'views/customElements/paginationView'
], function (content, AdminHistoryLogsCollection, paginationTemplate, PaginationView) {
    'use strict';

    var adminHistoryLogView = Backbone.View.extend({

        el: '#dataBlock',
        events: {
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
            return this;
        },

        render: function () {
            var el = this.$el;

            console.log('adminHistoryLogs render');
            el.html(this.template({collection: this.adminHistoryLogsCollection.toJSON()}));
            el.find("#paginationDiv").html(this.paginationView.render().$el);

            this.paginationView.showOrderBy(el);

            return this;
        }
    });

    return adminHistoryLogView;
});
