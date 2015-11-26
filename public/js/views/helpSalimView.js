define([
    'text!templates/helpSalimViewTemplate.html',
    'collections/helpSalim',
    'text!templates/pagination/paginationTemplate.html',
    'views/customElements/paginationView'
], function (content, HelpSalimCollection, paginationTemplate, PaginationView) {
    'use strict';

    var helpSalimView = Backbone.View.extend({

        el: '#dataBlock',
        template: _.template(content),
        events: {
            "click .oe_sortable": "goSort",
            'keyup #searchTerm': "searchByTerm"
        },

        initialize: function(options){
            this.helpSalimCollections = new HelpSalimCollection;
            this.paginationView = new PaginationView({
                collection: this.helpSalimCollections,
                countPerPage: options.countPerPage,
                url: 'helpSalim',
                urlGetCount: this.helpSalimCollections.url + 'getCount',
                padding: 2,
                page: options.page,
                ends: true,
                steps: true,
                data: {
                    orderBy: options.orderBy,
                    order: options.order,
                    searchTerm: options.searchTerm
                }
            });

            if (!options.searchTerm) {
                App.searchTerm = '';
            }

            this.listenTo(this.helpSalimCollections, 'reset remove', this.render);
        },

        searchByTerm: function(e){
            var sortOrder = this.paginationView.stateModel.toJSON().data.orderBy;
            var sortBy = this.paginationView.stateModel.toJSON().data.order;
            var searchTerm =  e.target.value;

            App.searchTerm = searchTerm;

            console.log('searchTerm:',searchTerm);
            this.paginationView.setData({orderBy: sortBy, order: sortOrder, searchTerm: searchTerm});
        },

        goSort: function (e) {
            var target$ = $(e.target);
            var previousOrderBy = this.paginationView.stateModel.toJSON().data.orderBy;
            var previousOrder = this.paginationView.stateModel.toJSON().data.order;
            var searchTerm = this.paginationView.stateModel.toJSON().data.searchTerm;
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
            this.paginationView.setData({orderBy: sortBy, order: sortOrder, searchTerm: searchTerm});
        },

        render: function(){
            var el = this.$el;

            console.log('helpSalimView render');
            el.html(this.template({collection: this.helpSalimCollections.toJSON()}));
            el.find("#paginationDiv").html(this.paginationView.render().$el);
            el.find("#searchTerm").val(App.searchTerm ? App.searchTerm:'').focus();
            this.paginationView.showOrderBy(el);

            return this;
        }
    });

    return helpSalimView;
});