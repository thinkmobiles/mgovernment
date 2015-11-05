define([
    'text!templates/service/create.html',
    'text!templates/service/inputItemsBlock.html',
    'models/service',
    'validation'
], function (content,inputBlockTemplate, ServiceModel, Validation) {
    'use strict';

    var itemBlockCount = 0;
    var itemsInputNameArray = [];
    var profileBlockCount = 0;
    var sendParams ={};

    var serviceCreateView = Backbone.View.extend({

        el: '#dataBlock',
        template: _.template(content),

        events: {
            'click #saveBtn' : 'saveService',
            'click #closeBtn' : 'hideMobileDisplay',
            'click #seeBtn' : 'showMobileDisplay',

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

        hideMobileDisplay: function(){
            var el = this.$el;
            el.find('#showMobileDisplay').hide();
            el.find('#showBlockScreen').hide();
        },

        showMobileDisplay: function(){
            var el = this.$el;
            var data = this.readInputsAndValidate();
            var display = el.find('#showMobileDisplay');
            var displayContent = "";
            var tempObj;

            displayContent += '<div style="margin-top:170px; color: white; font-weight: bold; font-size: 1.2em">' +  data.serviceName.toUpperCase() + '</div>';
            displayContent += '<br><br><br><br><br>';
            displayContent += '<div style="color: white;font-size: 1.2em">' +  data.serviceName +  ' Service </div>';
            displayContent += '<br>';
            displayContent += '<br>';

            console.log('data before sorting',data);

            //sort
            for (var j = data.inputItems.length - 1; j >= 0; j-- ) {
                for (var i = j - 1; i >= 0; i--) {
                    if (+data.inputItems[j].order > +data.inputItems[i].order) {
                        tempObj = data.inputItems[i];
                        data.inputItems[i] = data.inputItems[j];
                        data.inputItems[j] = tempObj;
                    }
                }
            }
            console.log('data after sorting',data);

            for (var i = data.inputItems.length - 1; i >= 0; i-- ){

                if (data.inputItems[i].inputType === 'file') {
                    displayContent += '<div style="color: lightslategray; text-align: left; margin-left: 100px;">' + data.inputItems[i].displayName.EN + ' <img src="../img/attachSmall.png"></div>';
                } else {

                    displayContent += '<div style="color: lightslategray; text-align: left; margin-left: 100px;">' + data.inputItems[i].displayName.EN + '</div>';

                    if (data.inputItems[i].inputType === 'string' || data.inputItems[i].inputType === 'number'|| data.inputItems[i].inputType === 'boolean') {
                        displayContent += '<hr style="width: 60%; color: gray">';
                    }

                    if (data.inputItems[i].inputType === 'text') {
                        displayContent += '<div style="margin-left: 100px; width: 60%; height: 55px; border: 1px solid grey;background-color: grey; opacity: 0.2"></div>';
                    }
                }
            }

            el.find('#showBlockScreen').show();
            display.html(displayContent);

            display.css({"background": "url('../img/mobile.jpg')", "background-size":"100% 100%"}).show();
        },

        addProfileFieldBlock: function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            var textContent = '<td><b>profile.</b><input type="text" name="" id="profileFieldName' + profileBlockCount + '" size="10" maxlength="20"></td><td><input type="text" name="" id="profileFieldValue' + profileBlockCount + '" size="20" maxlength="40"></td><td> Input profile. fileds name and fields value </td>';

            $("<tr> </tr>").
                attr("id", "profileFieldBlock" + profileBlockCount).
                html(textContent).
                insertBefore("#profileBlock");

            profileBlockCount++;
        },

        delProfileFieldBlock: function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            if (profileBlockCount === 0) {
                return this;
            }
            profileBlockCount--;

            $("#profileFieldBlock" + profileBlockCount).
                remove();
            return this;
        },

        addInputItemsBlock: function(e) {

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            $("#itemBlock").before(_.template(inputBlockTemplate)({i: itemBlockCount}));
            itemBlockCount++;
            return this;
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
            return this;
        },

        enableInput: function(e) {
            var idName = e.target.id;
            var el = this.$el;

            if (e.target.checked) {
                el.find('#'+ idName + 'Show').show();

            } else {
                el.find('#'+ idName + 'Show').hide();
            }
            return this;
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

            sendParams[id].push(el.find('#' + id + 'Input').val().trim());
            el.find('#' + id + 'Value').text(sendParams[id]);

            return this;
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

            return this;
        },

        readInputsAndValidate: function(){
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
                return 'error';
            }

            return data;
        },

        saveService: function(e){
            var model = new ServiceModel();
            var data = this.readInputsAndValidate();

            if (data !== 'error') {

                model.save(data, {
                    success: function (model, response) {
                        Backbone.history.history.back();
                    },
                    error: function (err, xhr, model, response) {
                        console.log('Error created', xhr);
                        alert(xhr.responseText);
                    }
                });
            }
            return this;
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

//TODO if  often using this View need cashing this 3 element

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