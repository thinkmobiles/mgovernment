define([
    'text!templates/service/update.html',
    'text!templates/service/inputItemsBlock.html'

], function (content,inputBlockTemplate) {
    var itemBlockCount = 0;
    var serviceUpdateView = Backbone.View.extend({
        el: '#dataBlock',
        template: _.template(content),

        events: {
            'click #updateBtn' : 'updateService',
            'click #addInputItemsBlock' : 'addInputItemsBlock',
            'click #delInputItemsBlock' : 'delInputItemsBlock',
            'change .enabledCheckBox' : 'enableInput'
        },

        initialize: function () {
            this.render();
            console.dir(Backbone.history);
        },

        addInputItemsBlock: function(e) {
            var el = this.$el;
            //this.template =  _.template(inputBlockTemplate);


            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            $("#itemBlock").before(_.template(inputBlockTemplate)({i: itemBlockCount}));

            itemBlockCount++;
        },

        delInputItemsBlock: function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            if (itemBlockCount === 0) {
                return;
            }
            itemBlockCount--;

            $("#itemBlockName" + itemBlockCount).
                empty().
                remove();

            $("#itemBlockInputType" + itemBlockCount).
                empty().
                remove();

            $("#itemBlockOrder" + itemBlockCount).
                empty().
                remove();

        },

        enableInput: function(e) {
            var idName = e.target.id;
            var el = this.$el;

            if (e.target.checked) {
                el.find('#'+ idName + 'Input').prop( "disabled", false );
            } else {
                el.find('#'+ idName + 'Input').prop( "disabled", true );
            }
        },

        updateService: function(e){
            var el = this.$el;
            var data ={};

            data.serviceProvider = el.find('#serviceProvider').val().trim();
            data.serviceName = el.find('#serviceName').val().trim();
            data.serviceType = el.find('#serviceType').val().trim();
            data.profile = {
                description: el.find('#description').val().trim()
            };
            data.baseUrl = el.find('#baseUrl').val().trim();

            data.forUserType = [];
            el.find('#guest')[0].checked ? data.forUserType.push('guest') : undefined;
            el.find('#client')[0].checked ? data.forUserType.push('client') : undefined;
            el.find('#admin')[0].checked ? data.forUserType.push('admin') : undefined;
            el.find('#company')[0].checked ? data.forUserType.push('company') : undefined;
            el.find('#government')[0].checked ?  data.forUserType.push('government') : undefined;

            data.method = el.find('#POST')[0].checked ? 'POST' : 'GET';
            data.url = el.find('#url').val().trim();
            data.params = {
                needUserAuth: el.find('#needUserAuth')[0].checked
            };

            if (el.find('#uriSpecQuery')[0].checked) {
                data.params.uriSpecQuery = el.find('#uriSpecQueryInput').val().replace(' ','').split(',');
            }

            if (el.find('#body')[0].checked) {
                data.params.body = el.find('#bodyInput').val().replace(' ','').split(',');
            }

            if (el.find('#query')[0].checked) {
                data.params.query = el.find('#queryInput').val().replace(' ','').split(',');
            }

            data.inputItems =[];

            for (var i = itemBlockCount - 1; i >= 0; i-- ){
                data.inputItems[i]= {
                    inputType: el.find('#inputType' + i).val().trim(),
                    name: el.find('#name' + i).val().trim(),
                    order: el.find('#order' + i).val().trim()
                }
            }
            console.log(itemBlockCount);

            console.dir(data);

            App.selectedService.save(data, {
                success: function(model, response){
                    Backbone.history.history.back();
                    //Backbone.history.fragment = '';
                    //Backbone.history.navigate('services', {trigger: true});
                    //console.log('Success updated');
                    //console.log(model);
                    //console.log(response);
                    //alert(model);

                },
                error: function(err, xhr, model, response){
                    console.log('Error updated',xhr);
                    alert(xhr.responseText);
                }
            });
        },

        render: function () {

            this.$el.html(this.template( App.selectedService.toJSON()));
            itemBlockCount =  App.selectedService.toJSON().inputItems.length;
            //console.log(itemBlockCount);
            return this;
        }
    });

    return serviceUpdateView;
});