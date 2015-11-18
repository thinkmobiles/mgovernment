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
                urlGetCount: this.userHistoryLogsCollection.url + 'getCount',
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
           // this.render();
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

            console.log('userHistoryLogs render');
            el.html(this.template({collection: this.userHistoryLogsCollection.toJSON()}));
            el.find("#paginationDiv").html(this.paginationView.render().$el);
            this.paginationView.showOrderBy(el);

            return this;
        }
    });

    return userHistoryLogView;
});
