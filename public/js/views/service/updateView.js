define([
    'text!templates/service/update.html',
    'text!templates/service/inputItemsBlock.html',
    'models/service',
    'validation'

], function (content,inputBlockTemplate, ServiceModel, Validation) {
    'use strict';

    var itemBlockCount = 0;
    var profileBlockCount = 0;
    var cloneService = false;
    var itemsInputNameArray = [];
    var sendParams ={};

    var serviceUpdateView = Backbone.View.extend({
        el: '#dataBlock',
        template: _.template(content),

        events: {
            'click #updateBtn' : 'updateService',
            'click #addProfileFieldBlock' : 'addProfileFieldBlock',
            'click #delProfileFieldBlock' : 'delProfileFieldBlock',
            'click #addInputItemsBlock' : 'addInputItemsBlock',
            'click #delInputItemsBlock' : 'delInputItemsBlock',
            'change .enabledCheckBox' : 'enableInput',
            'change .itemBlockName' : 'updateItemsInputNameArray',
            'click .actionButtonAdd' : 'addItemToArray',
            'click .actionButtonDell' : 'dellLastItemFromArray'
        },

        initialize: function (options) {
            cloneService = options ? options.cloneService : undefined;
            itemBlockCount = 0;
            profileBlockCount = 0;
            sendParams = {};
            itemsInputNameArray = [];

            this.render();
        },

        addProfileFieldBlock: function(e) {

            var textContent = '<td><b>profile.</b><input type="text" name="" id="profileFieldName' + profileBlockCount + '" size="10" maxlength="20"></td><td><input type="text" name="" id="profileFieldValue' + profileBlockCount + '" size="20" maxlength="40"></td><td> Input profile. fileds name and fields value </td>';

            $("<tr> </tr>").
                attr("id", "profileFieldBlock" + profileBlockCount).
                html(textContent).
                insertBefore("#profileBlock");

            profileBlockCount++;

        },

        delProfileFieldBlock: function(e) {

            if (profileBlockCount === 0) {
                return;
            }
            profileBlockCount--;

            $("#profileFieldBlock" + profileBlockCount).
                remove();

        },


        addInputItemsBlock: function(e) {
            var el = this.$el;

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            el.find("#itemBlock").before(_.template(inputBlockTemplate)({i: itemBlockCount}));

            itemBlockCount++;
        },

        delInputItemsBlock: function(e) {
            var el = this.$el;

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            if (itemBlockCount === 0) {
                return this;
            }
            itemBlockCount--;

            el.find("#itemBlockName" + itemBlockCount).
                empty().
                remove();

            el.find("#itemBlockInputType" + itemBlockCount).
                empty().
                remove();

            el.find("#itemBlockOrder" + itemBlockCount).
                empty().
                remove();

            el.find("#itemBlockRequired" + itemBlockCount).
                empty().
                remove();

            el.find("#itemBlockDisplayNameAR" + itemBlockCount).
                empty().
                remove();

            el.find("#itemBlockDisplayNameEN" + itemBlockCount).
                empty().
                remove();

            this.updateItemsInputNameArray();

        },

        enableInput: function(e) {
            var idName = e.target.id;
            var el = this.$el;

            if (e.target.checked) {
                el.find('#'+ idName + 'Show').show();
            } else {
                el.find('#'+ idName + 'Show').hide();
            }

        },

        updateService: function(e){
            var model = new ServiceModel();
            var el = this.$el;
            var errors =[];
            var data ={};

            data.serviceProvider = el.find('#serviceProvider').val().trim();
            data.serviceName = el.find('#serviceName').val().trim();
            data.serviceType = el.find('#serviceType').val().trim();
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
                data.params.uriSpecQuery = sendParams.uriSpecQuery;
            }

            if (el.find('#body')[0].checked) {
                data.params.body = sendParams.body;
            }

            if (el.find('#query')[0].checked) {
                data.params.query = sendParams.query;
            }

            if (el.find('#port')[0].checked) {
                data.port = el.find('#portInput').val().trim();
            }

            data.inputItems =[];

            for (var i = itemBlockCount - 1; i >= 0; i-- ){
                data.inputItems[i]= {
                    inputType: el.find('#inputType' + i).val().trim(),
                    name: el.find('#name' + i).val().trim(),
                    order: el.find('#order' + i).val().trim(),
                    displayName:{
                        EN: el.find('#displayNameEN' + i).val().trim(),
                        AR: el.find('#displayNameAR' + i).val().trim()
                    },
                    required: el.find('#requiredCheck' + i)[0].checked
                }
            }

            if (profileBlockCount > 0) {
                data.profile = {};

                for (var i = profileBlockCount - 1; i >= 0; i-- ){
                    data.profile[el.find('#profileFieldName' + i).val().trim()] =  el.find('#profileFieldValue' + i).val().trim();
                }
            }

            console.dir(data);

            Validation.checkUrlField(errors, true, data.baseUrl, 'Base Url');
            Validation.checkCompanyNameField(errors, true, data.serviceProvider, 'serviceProvider');

            if (errors.length){
                alert(errors);
                return;
            }

            if (cloneService) {
                model.save(data, {
                    success: function(model, response){
                        Backbone.history.history.back();
                    },
                    error: function(err, xhr, model, response){
                        console.log('Error updated',xhr);
                        alert(xhr.responseText);
                    }
                });
            } else {
                App.selectedService.save(data, {
                    success: function (model, response) {
                        Backbone.history.history.back();
                    },
                    error: function (err, xhr, model, response) {
                        console.log('Error updated', xhr);
                        alert(xhr.responseText);
                    }
                });
            }

        },

        addItemToArray: function(e) {
            var el = this.$el;
            var id = $(e.target).attr('data-hash');
            var inputFieldName = el.find('#' + id + 'Input').val();

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            if (!sendParams[id]){
                sendParams[id] = []
            }

            if (!el.find('#' +  id)[0].checked || !inputFieldName || sendParams[id].indexOf(inputFieldName) >= 0 ) {
                return this;
            }

            console.log('addButtonClicked');
            sendParams[id].push(el.find('#' + id + 'Input').val().trim());
            el.find('#' + id + 'Value').text(sendParams[id]);
            console.log(id, ' ',  sendParams[id]);


        },

        dellLastItemFromArray: function(e) {
            var el = this.$el;
            var id = $(e.target).attr('data-hash');

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            if (!el.find('#' +  id)[0].checked || !sendParams[id].length ) {
                return this;
            }

            console.log('dellButtonClicked');
            sendParams[id].pop();
            el.find('#' + id + 'Value').text(sendParams[id]);

        },

        updateItemsInputNameArray: function () {
            var el = this.$el;
            var newOptionsValue = '';
            var value ='';

            itemsInputNameArray = [];

            for (var i = itemBlockCount - 1; i >= 0; i-- ){
                value = el.find('#name' + i).val().trim();

                if (value) {
                    itemsInputNameArray.push(value);
                    newOptionsValue = '<option>' + value + '</option>' + newOptionsValue;
                }
            }

            el.find('#bodyInput').html(newOptionsValue);
            el.find('#queryInput').html(newOptionsValue);
            el.find('#uriSpecQueryInput').html(newOptionsValue);

            console.log('itemsInputNameArray: ', itemsInputNameArray);

              },

        render: function () {
            var service = App.selectedService.toJSON();

            service.port =  service.port || undefined;
            service.profile =  service.profile

            this.$el.html(this.template( service));

            itemBlockCount =  App.selectedService.toJSON().inputItems.length;
            profileBlockCount =  Object.keys(App.selectedService.toJSON().profile).length;
            sendParams = App.selectedService.toJSON().params;

            this.updateItemsInputNameArray();

            return this;
        }
    });

    return serviceUpdateView;
});