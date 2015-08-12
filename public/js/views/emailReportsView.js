define([
    'text!templates/emailReportViewTemplate.html',
    'collections/emailReports',
    'text!templates/pagination/paginationTemplate.html',
    'views/customElements/paginationView'
],function(content, EmailReportsCollecion, paginationTemplate, PaginationView){
    var feedbacksView = Backbone.View.extend({

        el: '#dataBlock',
        events: {
            'change .filterServiceType': 'changeCollectionFilter',
            'click #createService': 'createService',
            'click #cloneService': 'cloneService',
            'click #deleteService': 'deleteService',
            'click #updateService': 'updateService'
        },

        template: _.template(content),

        changeCollectionFilter: function(){
            var el = this.$el;
            var filter = '';

            filter += el.find('#filterHelpSalim')[0].checked ? '' : 'Help Salim,';
            filter += el.find('#filterSMSSpam')[0].checked ? '' : 'SMS Spam,';
            filter = filter.replace(/\,$/,'');
          console.log('filter',filter);
            this.paginationView.setData({filter: filter});
        },

        initialize: function(options){
            this.emailReportsCollecion =  new EmailReportsCollecion();
            this.paginationView = new PaginationView({
                collection   : this.emailReportsCollecion,
                countPerPage : options.countPerPage,
                url          : 'emailReports',
                urlGetCount  : '/emailReport/getCount',
                padding      : 2,
                page         : options.page,
                ends         : true,
                steps        : true,
                data         : {filter: options.filter }
            });

            this.listenTo(this.emailReportsCollecion, 'sync reset remove', this.render);
            this.render();
        },

        render: function () {

            console.log('emailReportsView render');
            console.log('filter: ', this.paginationView.stateModel.toJSON().data);
            this.$el.html(this.template({collection: this.emailReportsCollecion.toJSON(), filter: this.paginationView.stateModel.toJSON().data.filter}));
            this.$el.find("#paginationDiv").html(this.paginationView.render().$el);
        }
    });

    return feedbacksView;
});
