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
            'keyup #searchTerm': "searchByTerm"
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

        initialize: function (options) {
            this.emailReportsCollecion = new EmailReportsCollecion();

            this.paginationView = new PaginationView({
                collection: this.emailReportsCollecion,
                countPerPage: options.countPerPage,
                url: 'emailReports',
                urlGetCount: '/emailReport/getCount',
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

            App.searchTerm = searchTerm;

            console.log('serchTerm:',searchTerm);
            this.paginationView.setData({searchTerm: searchTerm});
            this.paginationView.setData({orderBy: sortBy, order: sortOrder, filter: filter, searchTerm: searchTerm});
        },

        goSort: function (e) {
            var target$ = $(e.target);
            //var currentParrentSortClass = target$.attr('class');
            //var sortClass = currentParrentSortClass.split(' ')[1];

            var previousOrderBy = this.paginationView.stateModel.toJSON().data.orderBy;
            var previousOrder = this.paginationView.stateModel.toJSON().data.order;
            var filter = this.paginationView.stateModel.toJSON().data.filter;
            var searchTerm = this.paginationView.stateModel.toJSON().data.searchTerm;
            var sortClass;

            var sortBy = target$.data('sort');
            var sortOrder = 1;

            if (previousOrderBy === sortBy) {
                sortOrder = previousOrder * -1;
            }

            sortClass = (sortOrder == -1) ? 'sortUp' : 'sortDn';

            //TODO add feature ^ up and down show order or delete this code

            switch (sortClass) {
                case "sortDn":
                {
                    target$.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                    target$.removeClass('sortDn').addClass('sortUp');
                    //order = 1;
                }
                    break;
                case "sortUp":
                {
                    target$.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                    target$.removeClass('sortUp').addClass('sortDn');
                    //order = -1;
                }
                    break;
            }

            this.paginationView.setData({orderBy: sortBy, order: sortOrder, filter: filter,  searchTerm: searchTerm});
        },

        render: function () {
            console.log('emailReportsView render');
            console.log('filter: ', this.paginationView.stateModel.toJSON().data);

            this.$el.html(this.template({
                collection: this.emailReportsCollecion.toJSON(),
                filter: this.paginationView.stateModel.toJSON().data.filter
            }));

            filterCheckbox = $('.filterServiceType');
            this.$el.find("#paginationDiv").html(this.paginationView.render().$el);
            $("#searchTerm").val(App.searchTerm ? App.searchTerm:'').focus();
            return this;
        }
    });

    return feedbacksView;
});
