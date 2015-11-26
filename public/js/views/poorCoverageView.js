define([
    'text!templates/poorCoveragesViewTemplate.html',
    'collections/poorCoverages',
    'models/csv',
    'text!templates/pagination/paginationTemplate.html',
    'views/customElements/paginationView'
], function (content, PoorCoveragesCollection, CsvModel, paginationTemplate, PaginationView) {
    'use strict';

    var poorCoveragesView = Backbone.View.extend({

        el: '#dataBlock',
        template: _.template(content),
        events: {
            "click .oe_sortable": "goSort",
            'keyup #searchTerm': "searchByTerm",
            "click #exportCsv": "toExportCsv"
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
                    order: options.order,
                    searchTerm: options.searchTerm
                }
            });

            if (!options.searchTerm) {
                App.searchTerm = '';
            }

            this.listenTo(this.poorCoveragesCollections, 'reset remove', this.render);
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

        toExportCsv: function(e){
            var csv = new CsvModel();
            csv.urlRoot += 'poorCoverage/exportCSV?searchTerm=' + App.searchTerm;
            csv.fetch({
                success: function(model,res) {
                    window.location.href = res.path;
                },
                error: function(){
                    alert('Export error');
                }
            });
        },

        render: function(){
            var el = this.$el;

            console.log('poorCoverageView render');
            el.html(this.template({collection: this.poorCoveragesCollections.toJSON()}));
            el.find("#paginationDiv").html(this.paginationView.render().$el);
            el.find("#searchTerm").val(App.searchTerm ? App.searchTerm:'').focus();
            this.paginationView.showOrderBy(el);

            return this;
        }
    });

    return poorCoveragesView;
});