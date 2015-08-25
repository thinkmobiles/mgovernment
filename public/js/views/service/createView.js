define([
    'text!templates/service/create.html',
    'text!templates/service/inputItemsBlock.html',
    'models/service',
    'validation'
], function (content,inputBlockTemplate, ServiceModel, Validation) {
    var itemBlockCount = 0;
    var itemsInputNameArray = [];
    var profileBlockCount = 0;
    var sendParams ={};



    var serviceCreateView = Backbone.View.extend({

        el: '#dataBlock',
        template: _.template(content),

        events: {
            'click #saveBtn' : 'saveService',
            'click #addProfileFieldBlock' : 'addProfileFieldBlock',
            'click #delProfileFieldBlock' : 'delProfileFieldBlock',
            'click #addInputItemsBlock' : 'addInputItemsBlock',
            'click #delInputItemsBlock' : 'delInputItemsBlock',
            'change .enabledCheckBox' : 'enableInput',
            'change .itemBlockName' : 'updateItemsInputNameArray',
            'click .actionButtonAdd' : 'addItemToArray',
            'click .actionButtonDell' : 'dellLastItemFromArray'
        },

        initialize: function () {
            itemBlockCount = 0;
            profileBlockCount = 0;
            sendParams = {};
            itemsInputNameArray = [];
            this.render();
        },

        addProfileFieldBlock: function(e) {
            //e.preventDefault();
            //e.stopPropagation();
            //e.stopImmediatePropagation();

            var textContent = '<td><b>profile.</b><input type="text" name="" id="profileFieldName' + profileBlockCount + '" size="10" maxlength="20"></td><td><input type="text" name="" id="profileFieldValue' + profileBlockCount + '" size="20" maxlength="40"></td><td> Input profile. fileds name and fields value </td>';

            $("<tr> </tr>").
                attr("id", "profileFieldBlock" + profileBlockCount).
                html(textContent).
                insertBefore("#profileBlock");

            profileBlockCount++;
        },

        delProfileFieldBlock: function(e) {
            //e.preventDefault();
            //e.stopPropagation();
            //e.stopImmediatePropagation();

            if (profileBlockCount === 0) {
                return;
            }
            profileBlockCount--;

            $("#profileFieldBlock" + profileBlockCount).
                remove();
        },

        addInputItemsBlock: function(e) {

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
                return this;
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
            updateItemsInputNameArray();
            return this;
        },

        enableInput: function(e) {
            var idName = e.target.id;
            var el = this.$el;

            if (e.target.checked) {
                //el.find('#'+ idName + 'Input').css( "display", "inline" );
                el.find('#'+ idName + 'Show').css( "display", "block" );
                //el.find('#'+ idName + 'AddInputButton').css( "display", "inline" );
                //el.find('#'+ idName + 'DellInputButton').css( "display", "inline" );

            } else {
                //el.find('#'+ idName + 'Input').css( "display", "none" );
                el.find('#'+ idName + 'Show').css( "display", "none" );
                //el.find('#'+ idName + 'AddInputButton').css( "display", "none" );
                //el.find('#'+ idName + 'DellInputButton').css( "display", "none" );
            }
        },

        addItemToArray: function(e) {
            var el = this.$el;
            var id = $(e.target).attr('data-hash');
            var inputFieldName = el.find('#' + id + 'Input').val();
            console.log(id, ' ',  sendParams[id]);

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            if (!sendParams[id]){
                sendParams[id] = []
            }

            if (!el.find('#' +  id)[0].checked || !inputFieldName || sendParams[id].indexOf(inputFieldName) >= 0 ) {
                return this;
            }
            //TODO inputFieldName validate in inputFieldNames

            console.log('addButtonClicked');

            sendParams[id].push(el.find('#' + id + 'Input').val().trim());
            el.find('#' + id + 'Value').text(sendParams[id]);
            //console.log(id, ' ',  sendParams[id]);

            return this;
        },

        dellLastItemFromArray: function(e) {
            var el = this.$el;
            var id = $(e.target).attr('data-hash');
            //var inputFieldName = el.find('#' + id + 'Input').val().trim();

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            if (!el.find('#' +  id)[0].checked || !sendParams[id].length ) {
                return this;
            }

            console.log('dellButtonClicked');
            sendParams[id].pop();
            el.find('#' + id + 'Value').text(sendParams[id]);
            //console.log(id, ' ',  sendParams[id]);

            return this;
        },

        saveService: function(e){
            var el = this.$el;
            var model = new ServiceModel();
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
            data.url = el.find('#url').val();
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
                    order: el.find('#order' + i).val().trim()
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

            model.save(data, {
                success: function(model, response){
                    Backbone.history.history.back();
                },
                error: function(err, xhr, model, response){
                    console.log('Error created',xhr);
                    alert(xhr.responseText);
                }
            });
        },

        updateItemsInputNameArray: function () {
            var el = this.$el;
            var newOptionsValue = '';
            var value ='';
            itemsInputNameArray = [];

            for (var i = itemBlockCount - 1; i >= 0; i-- ){
                value = el.find('#name' + i).val().trim();
                itemsInputNameArray.push(value);
                newOptionsValue = '<option>' + value + '</option>' + newOptionsValue;
            }

            el.find('#bodyInput').html(newOptionsValue);
            el.find('#queryInput').html(newOptionsValue);
            el.find('#uriSpecQueryInput').html(newOptionsValue);

            console.log('itemsInputNameArray: ', itemsInputNameArray);

            return this;
        },

        render: function () {

            this.$el.html(this.template());
            return this;
        }
    });

    return serviceCreateView;
});


