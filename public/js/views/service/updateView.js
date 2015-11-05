define([
    'text!templates/service/update.html',
    'text!templates/service/create.html',
    'text!templates/service/inputItemsBlock.html',
    'text!templates/service/pagesBlock.html',
    'models/service',
    'collections/icons',
    'validation'

], function (content,createTemplate,inputBlockTemplate,pagesBlockTemplate, ServiceModel, IconsCollection, Validation) {
    'use strict';

    var itemBlockCount = [0];
    var pageBlockCount = 0;
    var profileBlockCount = 0;
    var cloneService = false;
    var newService = false;
    var iconsCollection;
    var selectedIcon;
    var searchIcon;
    var searchIconTerm;


    var selectIconDiv;
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
            'click #addPageBlock' : 'addPageBlock',
            'click .actionButtonHide' : 'hideBlock',
            'click .actionButtonShow' : 'showBlock',
            'click #delPageBlock' : 'delPageBlock',
            'click .addInputItemsBlock' : 'addInputItemsBlock',
            'click .delInputItemsBlock' : 'delInputItemsBlock',
            'change .enabledCheckBox' : 'enableInput',
            'change .itemBlockName' : 'updateItemsInputNameArray',
            'click .actionButtonAdd' : 'addItemToArray',
            'click .actionButtonDell' : 'dellLastItemFromArray',
            'change .inputType': 'checkSelected',
            'click #selectIconShow': 'showSelectIcon',
            'click #selectIcon': 'selectIcon',
            'click #closeIcon': 'closeSelectIcon',
            'click .iconSelectList': 'preSelectIcon',
            'keyup #searchTerm': 'searchSelectIcon'

        },

        initialize: function (options) {
            cloneService = options ? options.cloneService : undefined;
            newService = options ? options.newService : undefined;
            itemBlockCount = [0];
            pageBlockCount = 0;
            profileBlockCount = 0;
            sendParams = {};
            itemsInputNameArray = [];
            iconsCollection = [];
            selectedIcon = null;
            selectIconDiv = null;
            searchIconTerm ='';

            this.render();
        },

        searchSelectIcon: function(e){
            searchIconTerm = $(e.target).val();
            console.log('searchSelectIcon: ',searchIconTerm);
            this.showSelectIcon();
        },

        preSelectIcon: function(e){
            var iconId =  $(e.currentTarget).attr('data-hash');
            selectedIcon = iconsCollection.toJSON()[iconId];
            console.log('preSelectIcon clicked',iconId);
            selectIconDiv.find('#selectedIcon').text(selectedIcon.title);
        },

        closeSelectIcon: function (e){
            console.log('Close clicked');
            e.preventDefault();
            e.stopPropagation();
            selectIconDiv.hide();
        },

        selectIcon: function (e){
            console.log('selectIcon clicked');
            e.preventDefault();
            e.stopPropagation();

            if (selectedIcon) {
                $('#icon').attr('src', selectedIcon['@2x']);
                $('#icon').attr('data-hash', selectedIcon._id);
                selectIconDiv.hide();
            }
        },

        showSelectIcon: function(e) {
            var el = this.$el;
            iconsCollection = new IconsCollection();
            var data = {
                type: '@2x'
            };
            var iconId;
            var iconDiv;
            var textContent;
            var iconList;
            var icon;

            console.log('Show selectIcon clicked');

            if (searchIconTerm) {
                data.searchTerm = searchIconTerm;
            }

            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            iconsCollection.fetch({data: data,
                success: function(){

                    console.dir('Loaded iconsCollection: ',iconsCollection.toJSON());

                    //iconList.find('.iconSelectList:odd').css("background-color", "whitesmoke");
                    if (!selectIconDiv) {
                        require(['text!templates/customElements/selectIconTemplate.html'], function (SelectTemplate) {
                            selectIconDiv = $(SelectTemplate);
                            selectIconDiv.hide();
                            el.append(selectIconDiv);
                            updateIconList();
                        });
                    } else {
                        selectIconDiv.hide();
                        updateIconList();
                    }

                },
                error: function(err, xhr, model){
                    alert(xhr);
                }
            });

            function updateIconList (){
                iconList = selectIconDiv.find('#iconList');
                iconList.html('');

                for (var i = 0,l = iconsCollection.length-1; i <= l; i++){
                    icon = iconsCollection.toJSON()[i];
                    iconId = icon._id;
                    iconDiv = $("#DbList" + iconId);
                    textContent = '<img src ="' + icon['@2x'] + '" style="float:left; height: 48px; width: 48px">' + icon.title;

                    if (!iconDiv.length) {
                        $("<div> </div>").
                            attr("id", "DbList" + iconId).
                            attr("class", "iconSelectList").
                            attr("data-hash", "" + i).
                            html(textContent).
                            appendTo(iconList);
                    }
                }
                console.log('Update IconList lunched');
                selectIconDiv.show();
            }
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
        },

        checkSelected: function(e) {
            var el = this.$el;
            var i = $(e.target).attr('data-hash');

            if (e.target.value === 'picker'){
                el.find('#itemBlockInputDataSource' + i).show();

            } else {
                el.find('#itemBlockInputDataSource' + i).hide();
            }
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
            displayContent += '<div style="margin-top:15px; margin-bottom:18px; margin-left: 2px"><img src = "' + (data.icon ? '/icon/' + data.icon + '/@2x"': '"') + ' style="width: 64px; height: 64px; -webkit-filter: brightness() invert();"></div>';
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
            displayContent += '<div  class="showArea' + language + '" data-hash="buttonTitleEN" style=" margin-top: 3px; text-align: center">';
            displayContent += '<span style="min-height: 20px; border: 1px solid grey;min-width: 50px; background-color: ghostwhite; opacity: 0.7;  border-radius: 6px; display: inline-block;"> ' + data.buttonTitle[language] + ' </span>';
            displayContent += '</div>';
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

        addPageBlock: function(e) {
            var el = this.$el;
            var htmlContent;

            e.preventDefault();
            e.stopPropagation();


            el.find("#pagesBlock").before(_.template(pagesBlockTemplate)({pageBlockCount: pageBlockCount}));

            pageBlockCount++;
            itemBlockCount[pageBlockCount] = 0;
        },



        showBlock: function(e) {
            var el = this.$el;
            var blockClassName = $(e.target).attr('data-hash');

            e.preventDefault();
            e.stopPropagation();

            el.find("." + blockClassName).show();
            console.log("preesed  show: ",blockClassName)
        },

        hideBlock: function(e) {
            var el = this.$el;
            var blockClassName = $(e.target).attr('data-hash');

            e.preventDefault();
            e.stopPropagation();

            el.find("." + blockClassName ).hide();
            console.log("preesed  hide: ",blockClassName)
        },

        addInputItemsBlock: function(e) {
            var el = this.$el;
            var page = +($(e.target).attr('data-page'));
            //console.log('page: ', page,' type of: ', typeof(page));

            e.preventDefault();
            e.stopPropagation();


            el.find("#itemBlockPage" + page).before(_.template(inputBlockTemplate)({i: itemBlockCount[page], page:  page}));

            itemBlockCount[page]++;
            console.log('itemBlockCount[',page,']: ', itemBlockCount[page]);
        },

        delInputItemsBlock: function(e) {
            var el = this.$el;
            var page = $(e.target).attr('data-page');

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            if (!itemBlockCount[page] || itemBlockCount[page] === 0) {
                return this;
            }

            itemBlockCount[page]--;
            el.find("#page" + page +"itemBlock" + itemBlockCount[page]).
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


            data.buttonTitle = {
                EN: el.find('#buttonTitleEN').val().trim(),
                AR: el.find('#buttonTitleAR').val().trim()
            };
            data.baseUrl = el.find('#baseUrl').val().trim();
            data.icon = el.find('#icon').attr('data-hash');
            data.icon =  data.icon ?  data.icon : null;

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
            var itemTempTemplate;
            var pageTempTemplate;
            var inpuItems;
            var textPage;

            if (newService) {
                console.log ('newService: ', newService);
                el.html(_.template(createTemplate));
                return this;
            }

            service = App.selectedService.toJSON();
            service.port =  service.port || undefined;
            service.profile =  service.profile || undefined;

            console.dir(service);

            el.html(this.template({service: service}));

            profileBlockCount =  service.profile ? Object.keys(service.profile).length : 0;
            sendParams = service.params;
            pageBlockCount = service.pages.length;


            //itemBlockCount =  inpuItems.length;
            itemBlockCount = [];


            //el.find("#itemBlockPage" + page).before(_.template(inputBlockTemplate)({i: itemBlockCount[page], page:  page}));



            console.log(itemBlockCount);
            for (var j = 0; j <= pageBlockCount - 1; j ++) {

                el.find("#pagesBlock").before(_.template(pagesBlockTemplate)({pageBlockCount: j}));
                console.dir(service.pages[j]);
                itemBlockCount[j] = service.pages[j].inputItems.length;
                textPage = '#page'+j;
                inpuItems = service.pages[j].inputItems;

                for (var i = 0; i <= itemBlockCount[j] - 1; i++) {

                    itemTempTemplate = $(_.template(inputBlockTemplate)({i: i, page: j}));
                    itemTempTemplate.find(textPage + 'inputType' + i).val(inpuItems[i].inputType);
                    itemTempTemplate.find(textPage + 'name' + i).val(inpuItems[i].name);
                    itemTempTemplate.find(textPage + 'order' + i).val(inpuItems[i].order);

                    itemTempTemplate.find(textPage + 'displayNameEN' + i).val(inpuItems[i].displayName ? inpuItems[i].displayName.EN : '');
                    itemTempTemplate.find(textPage + 'displayNameAR' + i).val(inpuItems[i].displayName ? inpuItems[i].displayName.AR : '');
                    itemTempTemplate.find(textPage + 'placeHolderEN' + i).val(inpuItems[i].placeHolder ? inpuItems[i].placeHolder.EN : '');
                    itemTempTemplate.find(textPage + 'placeHolderAR' + i).val(inpuItems[i].placeHolder ? inpuItems[i].placeHolder.AR : '');
                    itemTempTemplate.find(textPage + 'requiredCheck' + i).prop('checked', inpuItems[i].required);
                    itemTempTemplate.find(textPage + 'inputValidate' + i).val(inpuItems[i].validateAs);

                    if (inpuItems[i].dataSource && inpuItems[i].dataSource.length) {
                        sendParams['inputDataSource' + i] = inpuItems[i].dataSource;
                        itemTempTemplate.find(textPage +'dataSourceValue' + i).text(JSON.stringify(sendParams['inputDataSource' + i]));

                    }

                    if (inpuItems[i].inputType === 'picker' || inpuItems[i].inputType === 'table') {
                        itemTempTemplate.find(textPage + 'itemBlockInputDataSource' + i).show();
                    }

                    //console.log(typeof(itemTempTemplate), '  ', itemTempTemplate);
                    el.find("#itemBlockPage" + j).before(itemTempTemplate);
                }
            }

            this.updateItemsInputNameArray();
            console.dir(sendParams);

            return this;
        }
    });

    return serviceUpdateView;
});