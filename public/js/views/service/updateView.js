define([
    'text!templates/service/update.html',
    'text!templates/service/create.html',
    'text!templates/service/inputItemsBlock.html',
    'models/service',
    'validation'

], function (content,createTemplate,inputBlockTemplate, ServiceModel, Validation) {
    'use strict';

    var itemBlockCount = 0;
    var profileBlockCount = 0;
    var cloneService = false;
    var newService = false;

    var itemsInputNameArray = [];
    var sendParams ={};
    var language = 'EN';

    var serviceUpdateView = Backbone.View.extend({
        el: '#dataBlock',
        template: _.template(content),

        events: {
            'click #updateBtn' : 'updateService',
            'click #closeBtn' : 'hideMobileDisplay',
            'click .showAreaEN, .showAreaAR' : 'showSelectedItem',
            'click .mobileBtn' : 'changeMobileLanguage',
            'click #seeBtn, #refreshBtn' : 'showMobileDisplay',
            'click #addProfileFieldBlock' : 'addProfileFieldBlock',
            'click #delProfileFieldBlock' : 'delProfileFieldBlock',
            'click #addInputItemsBlock' : 'addInputItemsBlock',
            'click #delInputItemsBlock' : 'delInputItemsBlock',
            'change .enabledCheckBox' : 'enableInput',
            'change .itemBlockName' : 'updateItemsInputNameArray',
            'click .actionButtonAdd' : 'addItemToArray',
            'click .actionButtonDell' : 'dellLastItemFromArray',
            'change .inputType': 'checkSelected'
        },

        initialize: function (options) {
            cloneService = options ? options.cloneService : undefined;
            newService = options ? options.newService : undefined;
            itemBlockCount = 0;
            profileBlockCount = 0;
            sendParams = {};
            itemsInputNameArray = [];

            this.render();
        },

        changeMobileLanguage: function(e){
            var lang = this.$el.find(e.target).attr('data-hash');
            console.log('change language clocked');
            language =  lang ? lang: language;
            this.showMobileDisplay();
        },

        showSelectedItem: function(e){
            var el = this.$el;
            var id = $(e.target).attr('data-hash');

            if (!id) {
                id = $(e.target.parentElement).attr('data-hash');
            }
            console.log('Show Selected: ',id);

            if (navigator.userAgent.search("Safari") >= 0 ) {
                $('body').animate({scrollTop: $('#' + id).offset().top}, 1100);
            } else {
                $('html').animate({scrollTop: $('#' + id).offset().top}, 1100);
            };
            //$(document).scrollTo('#' + id);
        },

        checkSelected: function(e) {
            var el = this.$el;
            var i = $(e.target).attr('data-hash');

            if (e.target.value === 'picker'){
                el.find('#itemBlockInputDataSource' + i).show();

            } else {
                el.find('#itemBlockInputDataSource' + i).hide();
            }

            //console.dir(e.target);
            console.log(e.target.value);
        },

        hideMobileDisplay: function(){
            var el = this.$el;
            el.find('#mobilePhone').hide();
            el.find('#mobileDisplay').hide();
        },

        showMobileDisplay: function(){
            var el = this.$el;
            var data = this.readInputsAndValidate();
            var display = el.find('#mobileDisplay');
            var displayContent = "";
            var tempObj;
            var tempOrder;
            console.dir('rided data', data);
            console.log('rided data2', data);

            if (data === 'error') {
                return this;
            }

            displayContent += '<div style="margin-top:15px; color: white; font-weight: bold; font-size: 1.2em">' +  data.serviceName[language].toUpperCase() + '</div>';
            displayContent += '<br><br><br><br><br>';
            displayContent += '<div style="color: white;font-size: 1.2em">' +  data.serviceName[language] +  (language == 'AR' ? ' \u0623\u062f\u0648\u0627\u062a' : ' Service') + ' </div>';
            displayContent += '<br>';
            displayContent += '<div style = "margin-left: 50px; margin-right: 47px; height:360px; overflow-y: auto">';
            console.log('data before sorting',data);

            console.log(' before sorting data.inputItems.length - 1',data.inputItems.length - 1);

            //sort

            for (var j = data.inputItems.length - 1; j >= 0; j-- ) {
                for (var i = j; i >= 0; i--) {
                    if (+data.inputItems[j].order > +data.inputItems[i].order) {

                        tempObj = data.inputItems[i];
                        data.inputItems[i] = data.inputItems[j];
                        data.inputItems[j] = tempObj;
                    }
                }
            }

            console.log('data after sorting',data);

            for (var i = data.inputItems.length - 1; i >= 0; i-- ){
                displayContent += '<div class="showArea' + language + '" data-hash="itemBlockOrder' + data.inputItems[i].displayOrder + '">';

                if (data.inputItems[i].inputType === 'file') {
                    displayContent += '<div style="color: lightslategray;">' + data.inputItems[i].displayName[language] + ' <img src="../img/attachSmall.png"></div>';
                } else {

                    displayContent += '<div style="color: lightslategray; ">' + data.inputItems[i].displayName[language] + '</div>';

                    if (data.inputItems[i].inputType === 'string' || data.inputItems[i].inputType === 'number'|| data.inputItems[i].inputType === 'boolean') {
                        displayContent += '<div style="color: black; border-bottom: 1px solid gray; width: 100%; height: 20px ">' + data.inputItems[i].placeHolder[language] + '</div>';
                    }

                    if (data.inputItems[i].inputType === 'picker') {
                        displayContent += '<div style="color: black; border-bottom: 1px solid gray; width: 100%">' + (data.inputItems[i].dataSource ? data.inputItems[i].dataSource[0] : '')  + ' &#x25bc</div>';
                    }


                    if (data.inputItems[i].inputType === 'text') {
                        displayContent += '<div style="width: 100%; height: 55px; border: 1px solid grey;background-color: ghostwhite; opacity: 0.5;">' + data.inputItems[i].placeHolder[language] + '</div>';
                    }
                }
                displayContent += '</div>';
            }
            displayContent += '</div>';

            el.find('#mobilePhone').css({"background": "url('../img/mobile.jpg')", "background-size":"100% 100%"}).show();
            display.html(displayContent).show();
            //console.log('displayContent:',displayContent);
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

            el.find("#itemBlock" + itemBlockCount).
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

        readInputsAndValidate: function(){
            var el = this.$el;
            var errors =[];
            var data ={};

            data.serviceProvider = el.find('#serviceProvider').val().trim();
            data.serviceName = {
                EN: el.find('#serviceNameEN').val().trim(),
                AR: el.find('#serviceNameAR').val().trim()
            };
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

            // TODO add check if empty and .trim()

            for (var i = itemBlockCount - 1; i >= 0; i-- ){
                data.inputItems[i]= {
                    inputType: el.find('#inputType' + i).val(),
                    name: el.find('#name' + i).val().trim(),
                    order: el.find('#order' + i).val().trim(),
                    displayName:{
                        EN: el.find('#displayNameEN' + i).val(),
                        AR: el.find('#displayNameAR' + i).val()
                    },
                    placeHolder:{
                        EN: el.find('#placeHolderEN' + i).val(),
                        AR: el.find('#placeHolderAR' + i).val()
                    },
                    required: el.find('#requiredCheck' + i)[0].checked,
                    validateAs: el.find('#inputValidate' + i).val(),
                    dataSource: sendParams['inputDataSource' + i],
                    displayOrder: i
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

        updateService: function(e) {
            var model = new ServiceModel();
            var data = this.readInputsAndValidate();
            console.dir('saved data ',data);


            if (data !== 'error') {
                if (cloneService || newService) {
                    model.save(data, {
                        success: function (model, response) {
                            Backbone.history.history.back();
                        },
                        error: function (err, xhr, model, response) {
                            console.log('Error updated', xhr);
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
            }
        },

        addItemToArray: function(e) {
            var el = this.$el;
            var id = $(e.target).attr('data-hash');
            var inputFieldName;
            var dataSourceId = $(e.target).attr('data-source');
            var dataSource;
            console.log('addButtonClicked', id);


            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            if (id) {
                inputFieldName = el.find('#' + id + 'Input').val();

                if (!sendParams[id]) {
                    sendParams[id] = []
                }

                if (!el.find('#' + id)[0].checked || !inputFieldName || sendParams[id].indexOf(inputFieldName) >= 0) {
                    return this;
                }

                sendParams[id].push(el.find('#' + id + 'Input').val().trim());
                el.find('#' + id + 'Value').text(sendParams[id]);
                console.log(id, ' ', sendParams[id]);

                return this;
            }
            if (dataSourceId){
                dataSource = 'inputDataSource' + dataSourceId;
                inputFieldName = el.find('#' + dataSource).val().trim();

                if (!sendParams[dataSource]) {
                    sendParams[dataSource] = []
                }
                sendParams[dataSource].push(inputFieldName);
                el.find('#dataSourceValue'  + dataSourceId).text(sendParams[dataSource]);
                el.find('#' + dataSource).val('');
            }
        },

        dellLastItemFromArray: function(e) {
            var el = this.$el;
            var id = $(e.target).attr('data-hash');
            var dataSourceId = $(e.target).attr('data-source');
            var dataSource = 'inputDataSource' + dataSourceId;

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            console.log('dellButtonClicked');

            if (id) {

                if (!el.find('#' + id)[0].checked || !sendParams[id].length) {
                    return this;
                }

                sendParams[id].pop();
                el.find('#' + id + 'Value').text(sendParams[id]);
            }

            if (dataSourceId) {

                sendParams[dataSource].pop();
                el.find('#dataSourceValue'  + dataSourceId).text(sendParams[dataSource]);
            }
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
            var service;
            var el = this.$el;
            var tempTemplate;
            var inpuItems;

            if (newService) {
                console.log ('newService: ', newService);
                el.html(_.template(createTemplate));
                return this;
            }

            service = App.selectedService.toJSON();
            service.port =  service.port || undefined;
            service.profile =  service.profile || undefined;

            console.dir(service);

            el.html(this.template( service));

            profileBlockCount =  service.profile ? Object.keys(service.profile).length : 0;
            sendParams = service.params;
            inpuItems = service.inputItems;
            itemBlockCount =  inpuItems.length;

            console.log(itemBlockCount);

            for (var i = 0; i < itemBlockCount; i++)
            {
                tempTemplate = $ (_.template(inputBlockTemplate)({i: i}));
                tempTemplate.find('#inputType' + i).val(inpuItems[i].inputType);
                tempTemplate.find('#name' + i).val(inpuItems[i].name);
                tempTemplate.find('#order' + i).val(inpuItems[i].order);
                tempTemplate.find('#displayNameEN' + i).val(inpuItems[i].displayName ? inpuItems[i].displayName.EN : '');
                tempTemplate.find('#displayNameAR' + i).val(inpuItems[i].displayName ? inpuItems[i].displayName.AR : '');
                tempTemplate.find('#placeHolderEN' + i).val(inpuItems[i].placeHolder ? inpuItems[i].placeHolder.EN : '');
                tempTemplate.find('#placeHolderAR' + i).val(inpuItems[i].placeHolder ? inpuItems[i].placeHolder.AR : '');
                tempTemplate.find('#requiredCheck' + i).prop('checked', inpuItems[i].required);
                tempTemplate.find('#inputValidate' + i).val(inpuItems[i].validateAs);

                if (inpuItems[i].dataSource && inpuItems[i].dataSource.length) {
                    sendParams['inputDataSource' + i] = inpuItems[i].dataSource;
                    tempTemplate.find('#dataSourceValue' + i).text( sendParams['inputDataSource' + i]);

                }
                if (inpuItems[i].inputType === 'picker') {
                    tempTemplate.find('#itemBlockInputDataSource' + i).show();
                }

                //console.log(typeof(tempTemplate), '  ', tempTemplate);
                el.find("#itemBlock").before(tempTemplate);
            }

            this.updateItemsInputNameArray();
            console.dir(sendParams);

            return this;
        }
    });

    return serviceUpdateView;
});