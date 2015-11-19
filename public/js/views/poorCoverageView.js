define([
    'text!templates/poorCoveragesViewTemplate.html',
    'collections/poorCoverages',
    'text!templates/pagination/paginationTemplate.html',
    'views/customElements/paginationView'
], function (content, PoorCoveragesCollection, paginationTemplate, PaginationView) {
    'use strict';

    var poorCoveragesView = Backbone.View.extend({

        el: '#dataBlock',
        template: _.template(content),
        events: {
            "click .oe_sortable": "goSort"
        },

        initialize: function(options){
            this.poorCoveragesCollections = new PoorCoveragesCollection;
            this.paginationView = new PaginationView({
                collection: this.poorCoveragesCollections,
                countPerPage: options.countPerPage,
                url: 'poorCoverage',
                urlGetCount: this.poorCoveragesCollections.url + 'getCount',
                padding: 2,
                page: options.page,
                ends: true,
                steps: true,
                data: {
                    orderBy: options.orderBy,
                    order: options.order
                }
            });

            this.listenTo(this.poorCoveragesCollections, 'reset remove', this.render);
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

        render: function(){
            var el = this.$el;

            console.log('poorCoveragesView render');
            el.html(this.template({collection: this.poorCoveragesCollections.toJSON()}));
            el.find("#paginationDiv").html(this.paginationView.render().$el);
            this.paginationView.showOrderBy(el);

            return this;
        }

    });

    return poorCoveragesView;
});