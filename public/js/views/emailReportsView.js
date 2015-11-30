define([
    'text!templates/emailReportViewTemplate.html',
    'collections/emailReports',
    'text!templates/pagination/paginationTemplate.html',
    'views/customElements/paginationView'
], function (content, EmailReportsCollecion, paginationTemplate, PaginationView) {
    'use strict';

    var filterCheckbox;
    var feedbacksView = Backbone.View.extend({

        el: '#dataBlock',
        events: {
            'change .filterServiceType': 'changeCollectionFilter',
            "click .oe_sortable": "goSort",
            'keyup #searchTerm': "searchByTerm",
            'click .trClicked': 'selectRow'
        },

        template: _.template(content),

        changeCollectionFilter: function () {
            var el = this.$el;
            var filter = '';

            for (var i = filterCheckbox.length - 1; i >= 0; i-- ){
                filter += filterCheckbox[i].checked ? '' : filterCheckbox[i].value + ',';
            }

            filter = filter.replace(/\,$/, '');
            console.log('filter: ', filter);
            this.paginationView.setData({filter: filter});
        },

        selectRow: function(e){
            var id = $(e.currentTarget ).attr('data-hash');

            $(e.currentTarget).parent().children().removeClass('rowSelected');
            $(e.currentTarget).addClass('rowSelected');

            this.selectedElementId = id;
        },

        initialize: function (options) {
            this.emailReportsCollecion = new EmailReportsCollecion();

            this.paginationView = new PaginationView({
                collection: this.emailReportsCollecion,
                countPerPage: options.countPerPage,
                url: 'emailReports',
                urlGetCount: this.emailReportsCollecion.url + 'getCount',
                padding: 2,
                page: options.page,
                ends: true,
                steps: true,
                data: {
                    filter: options.filter,
                    orderBy: options.orderBy,
                    order: options.order,
                    searchTerm: options.searchTerm
                }
            });

            if (!options.searchTerm) {
                App.searchTerm = '';
            }

            this.listenTo(this.emailReportsCollecion, 'reset remove', this.render);
            //this.render();
        },

        searchByTerm: function(e){
            var sortOrder = this.paginationView.stateModel.toJSON().data.orderBy;
            var sortBy = this.paginationView.stateModel.toJSON().data.order;
            var filter = this.paginationView.stateModel.toJSON().data.filter;
            var searchTerm =  e.target.value;
            $(searchTerm).next().addClass('active');

            App.searchTerm = searchTerm;

            console.log('serchTerm:',searchTerm);
            //this.paginationView.setData({searchTerm: searchTerm});
            this.paginationView.setData({orderBy: sortBy, order: sortOrder, filter: filter, searchTerm: searchTerm});
        },

        goSort: function (e) {
            var target$ = $(e.target);
            var previousOrderBy = this.paginationView.stateModel.toJSON().data.orderBy;
            var previousOrder = this.paginationView.stateModel.toJSON().data.order;
            var filter = this.paginationView.stateModel.toJSON().data.filter;
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

            this.paginationView.setData({orderBy: sortBy, order: sortOrder, filter: filter,  searchTerm: searchTerm});
        },

        render: function () {
            var el = this.$el;

            console.log('emailReportsView render');
            console.log('filter: ', this.paginationView.stateModel.toJSON().data);

            el.html(this.template({
                collection: this.emailReportsCollecion.toJSON(),
                filter: this.paginationView.stateModel.toJSON().data.filter
            }));

            filterCheckbox = $('.filterServiceType');
            el.find("#paginationDiv").html(this.paginationView.render().$el);
            el.find("#searchTerm").val(App.searchTerm ? App.searchTerm:'').focus();
            this.paginationView.showOrderBy(el);

            return this;
        }
    });

    return feedbacksView;
});
