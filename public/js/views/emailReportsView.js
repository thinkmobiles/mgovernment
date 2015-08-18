define([
    'text!templates/emailReportViewTemplate.html',
    'collections/emailReports',
    'text!templates/pagination/paginationTemplate.html',
    'views/customElements/paginationView'
], function (content, EmailReportsCollecion, paginationTemplate, PaginationView) {
    var feedbacksView = Backbone.View.extend({

        el: '#dataBlock',
        events: {
            'change .filterServiceType': 'changeCollectionFilter',
            'click #createService': 'createService',
            'click #cloneService': 'cloneService',
            'click #deleteService': 'deleteService',
            'click #updateService': 'updateService',
            "click .oe_sortable": "goSort"
        },

        template: _.template(content),

        changeCollectionFilter: function () {
            var el = this.$el;
            var filter = '';

            filter += el.find('#filterHelpSalim')[0].checked ? '' : 'Help Salim,';
            filter += el.find('#filterSMSSpam')[0].checked ? '' : 'SMS Spam,';
            filter += el.find('#filterSMSBlock')[0].checked ? '' : 'SMS Block,';
            filter += el.find('#filterServiceProvider')[0].checked ? '' : 'Service Provider,';
            filter += el.find('#filterTRAService')[0].checked ? '' : 'TRA Service,';
            filter += el.find('#filterEnquiries')[0].checked ? '' : 'Enquiries,';
            filter += el.find('#filterSuggestion')[0].checked ? '' : 'Suggestion,';
            filter += el.find('#filterPoorCoverage')[0].checked ? '' : 'Poor Coverage,';

            filter = filter.replace(/\,$/, '');
            console.log('filter', filter);
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
                    order: options.order
                }
            });

            //this.listenTo(this.emailReportsCollecion, 'sync reset remove', this.render);
            this.listenTo(this.emailReportsCollecion, 'reset remove', this.render);
            this.render();
        },

        goSort: function (e) {
            var target$ = $(e.target);
            //var currentParrentSortClass = target$.attr('class');
            //var sortClass = currentParrentSortClass.split(' ')[1];

            var previousOrderBy = this.paginationView.stateModel.toJSON().data.orderBy;
            var previousOrder = this.paginationView.stateModel.toJSON().data.order;
            var filter = this.paginationView.stateModel.toJSON().data.filter;
            var sortClass;

            var sortBy = target$.data('sort');
            var sortOrder = 1;

            if (previousOrderBy === sortBy) {
                sortOrder = previousOrder * -1;
            }

            sortClass = (sortOrder == -1) ? 'sortUp' : 'sortDn';

            // if (!sortClass) {
            //    target$.addClass('sortDn');
            //    sortClass = "sortDn";
            //}

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
            //sortObject[sortBy] = sortConst;
            //this.fetchSortCollection(sortObject);
            //this.changeLocationHash(1, this.defaultItemsNumber);
            //this.getTotalLength(null, this.defaultItemsNumber, this.filter);
            this.paginationView.setData({orderBy: sortBy, order: sortOrder, filter: filter});
        },

        render: function () {
            console.log('emailReportsView render');
            console.log('filter: ', this.paginationView.stateModel.toJSON().data);
            this.$el.html(this.template({
                collection: this.emailReportsCollecion.toJSON(),
                filter: this.paginationView.stateModel.toJSON().data.filter
            }));
            this.$el.find("#paginationDiv").html(this.paginationView.render().$el);
        }
    });

    return feedbacksView;
});
