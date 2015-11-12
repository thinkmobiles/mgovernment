define([
    'text!templates/service/update.html',
    'text!templates/service/create.html',
    'text!templates/service/inputItemsBlock.html',
    'text!templates/service/pagesBlock.html',
    'text!templates/service/treeNode.html',
    'models/service',
    'collections/icons',
    'validation'

], function (content, createTemplate, inputBlockTemplate, pagesBlockTemplate, treeNodeTemplate, ServiceModel, IconsCollection, Validation) {
    'use strict';

    var itemBlockCount = [0];
    var pageBlockCount = 0;
    var profileBlockCount = 0;
    var cloneService = false;
    var isNewService = false;
    var treeNodeCounts = [1, 0, 0, 0, 0];
    var pagesTreeNodesValues = [];
    //TODO change this to {}
    var currentNodeValues = [returnNewTreeNodeObject('Node 0')];
    var iconsCollection;
    var selectedIcon;
    var searchIcon;
    var searchIconTerm;


    var selectIconDiv;
    var itemsInputNameArray = [];
    var sendParams = {};
    var language = 'EN';
    var currentMobilePage = 0;

    function returnNewTreeNodeObject(nodeName) {
        return {
            value: nodeName ? nodeName : '',
            EN: '',
            AR: '',
            items: []
        }
    }

    function recursionDellNodeObjByAddress(nodeObj, nodeAddressArray) {
        var index = +nodeAddressArray[0];

        if (nodeAddressArray.length == 1) {
            nodeObj.items[index] = undefined ;
            return;
        }

        nodeAddressArray.shift();
        return recursionDellNodeObjByAddress(nodeObj.items[index], nodeAddressArray);
    }

    function recursionCreateNodeObjByAddress(nodeObj, nodeAddressArray, nodeValue ) {
        var index = +nodeAddressArray[0];

        if (nodeAddressArray.length == 1) {
            nodeObj.items[index] = returnNewTreeNodeObject(nodeValue);
            return;
        }
        nodeAddressArray.shift();
        return recursionCreateNodeObjByAddress(nodeObj.items[index], nodeAddressArray, nodeValue);
    }

    function recursionReadNodeObjByAddress(nodeObj, nodeAddressArray) {
        var index = +nodeAddressArray[0];

        if (nodeAddressArray.length == 1) {
            return  nodeObj.items[index];
        }
        nodeAddressArray.shift();
        return recursionReadNodeObjByAddress(nodeObj.items[index], nodeAddressArray);
    }

    function recursionSaveNodeObjByAddress(nodeObj, nodeAddressArray, options ) { //options ( value:,  EN:, AR:,}
        var index = +nodeAddressArray[0];

        if (nodeAddressArray.length == 1) {
            nodeObj.items[index].value = options.value;
            nodeObj.items[index].EN = options.EN;
            nodeObj.items[index].AR = options.AR;
            return;
        }

        nodeAddressArray.shift();
        return recursionSaveNodeObjByAddress(nodeObj.items[index], nodeAddressArray, options);
    }

    function initializeTreeNode (nodeAddress, nodeValue){
        var treeNodeAddress = nodeAddress.split('_');
        var firstIndex = treeNodeAddress[0];

        if(treeNodeAddress.length == 1) {
            currentNodeValues[firstIndex] = returnNewTreeNodeObject(nodeValue);
        } else {
            treeNodeAddress.shift();
            recursionCreateNodeObjByAddress(currentNodeValues[firstIndex], treeNodeAddress, nodeValue);
        }
    }

    function readTreeNode (nodeAddress){
        var treeNodeAddress = nodeAddress.split('_');
        var firstIndex = treeNodeAddress[0];

        if(treeNodeAddress.length == 1) {
            return currentNodeValues[firstIndex];
        } else {
            treeNodeAddress.shift();
            return  recursionReadNodeObjByAddress(currentNodeValues[firstIndex], treeNodeAddress);
        }
    }

    function dellTreeNode (nodeAddress){
        var treeNodeAddress = nodeAddress.split('_');
        var firstIndex = treeNodeAddress[0];

        if (treeNodeAddress.length == 1) {
            currentNodeValues[treeNodeAddress[0]] = undefined;

            return;
        }
        treeNodeAddress.shift();
        recursionDellNodeObjByAddress(currentNodeValues[firstIndex], treeNodeAddress);
    }

    function saveTreeNode (nodeAddress, options){
        var treeNodeAddress = nodeAddress.split('_');
        var firstIndex = treeNodeAddress[0];

        if(treeNodeAddress.length == 1) {
            currentNodeValues[firstIndex].value = options.value;
            currentNodeValues[firstIndex].EN = options.EN;
            currentNodeValues[firstIndex].AR = options.AR;
            return;
        }
        treeNodeAddress.shift();
        recursionSaveNodeObjByAddress(currentNodeValues[firstIndex], treeNodeAddress, options);

    }


    var serviceUpdateView = Backbone.View.extend({
        el: '#dataBlock',
        template: _.template(content),

        events: {
            'click #updateBtn': 'updateService',
            'click #closeBtn': 'hideMobileDisplay',
            'click .showTreeBtn': 'showTreeBlock',
            'click .hideTreeBtn': 'hideTreeBlock',
            'click .saveTreeAndCloseBtn': 'saveTreeAndClose',
            'click .clickNodeName': 'selectTreeNodeGetInfo',
            'click #saveNode': 'clickSaveTreeNode',
            'click .addNode': 'treeAddNode',
            'click .addNodeItem': 'treeAddNodeItem',
            'click .dellNode': 'treeDellNode',
            'click .showAreaEN, .showAreaAR': 'showSelectedItem',
            'click .mobileBtn': 'changeMobileLanguage',
            'click #seeBtn, #refreshBtn': 'showMobileDisplay',
            'click #addProfileFieldBlock': 'addProfileFieldBlock',
            'click #delProfileFieldBlock': 'delProfileFieldBlock',
            'click #addPageBlock': 'addPageBlock',
            'click .actionButtonHide': 'hideBlock',
            'click .actionButtonShow': 'showBlock',
            'click #delPageBlock': 'delPageBlock',
            'click .addInputItemsBlock': 'addInputItemsBlock',
            'click .delInputItemsBlock': 'delInputItemsBlock',
            'change .enabledCheckBox': 'enableInput',
            'change .itemBlockName': 'updateItemsInputNameArray',
            'click .actionButtonAdd': 'addItemToArray',
            'click .actionButtonDell': 'dellLastItemFromArray',
            'change .inputType': 'checkSelected',
            'click #selectIconShow': 'showSelectIcon',
            'click #selectIcon': 'selectIcon',
            'click #closeIcon': 'closeSelectIcon',
            'click .iconSelectList': 'preSelectIcon',
            'keyup #searchTerm': 'searchSelectIcon',
            'click .mobileBtnPage': 'changePageOnMobile',
            'click .expandNode': 'treeExpandNode',
            'click .collapseNode': 'treeCollapseNode'
        },

        initialize: function (options) {
            cloneService = options ? options.cloneService : undefined;
            isNewService = options ? options.isNewService : undefined;
            treeNodeCounts = [1, 0, 0, 0, 0];
            itemBlockCount = [0];
            pagesTreeNodesValues = [];
            pageBlockCount = 0;
            profileBlockCount = 0;
            sendParams = {};
            itemsInputNameArray = [];
            iconsCollection = [];
            selectedIcon = null;
            selectIconDiv = null;
            searchIconTerm = '';

            this.render();
        },


        treeAddNode: function (e) {
            var el = $(e.currentTarget);
            var currentTreeUl = $($(el.parent()[0]).parents("ul"))[0];
            var nodeAddress = $(el.parent()[0]).attr('data-hash');
            var treeNodeAddress = nodeAddress.split('_');
            var newNodeAddress;


            e.preventDefault();
            e.stopPropagation();

            treeNodeAddress[treeNodeAddress.length - 1]++;
            treeNodeAddress[treeNodeAddress.length - 1] = treeNodeCounts[treeNodeAddress.length - 1];
            treeNodeCounts[treeNodeAddress.length - 1]++;
            newNodeAddress = treeNodeAddress.join('_');


            console.dir($($(el.parent()[0]).parents("ul"))[0]);


            //currentTreeUl.find('#nodeLi' + lastNodeAddress).after(_.template(treeNodeTemplate)({
            $(currentTreeUl).append(_.template(treeNodeTemplate)({
                node: {
                    address: newNodeAddress,
                    value: 'Node ' + newNodeAddress
                }
            }));

            initializeTreeNode(newNodeAddress,'Node ' + newNodeAddress);

            console.log('nodeAddress: ', nodeAddress);
            console.log('treeNodeAddress: ', treeNodeAddress);
        },

        treeDellNode: function (e) {
            var el = $(e.currentTarget);
            //console.dir($($(el.parent()[0]).parents("ul"))[0]);
            var currentTreeUl = $($(el.parent()[0]).parents("ul"))[0];
            var nodeAddress = $(el.parent()[0]).attr('data-hash');

            e.preventDefault();
            e.stopPropagation();

            $(currentTreeUl).find('#nodeLi' + nodeAddress).remove();
            dellTreeNode(nodeAddress);
            console.log('nodeAddress: ', nodeAddress);
        },

        clickSaveTreeNode: function (e) {
            var el = $(e.currentTarget);
            var nodeAddress = $(el).attr('data-hash');
            var treeDiv = $(this.$el).find('#treeDiv');
            var options = {
                value: treeDiv.find('#treeValue').val(),
                EN: treeDiv.find('#treeEN').val(),
                AR: treeDiv.find('#treeAR').val()
            };

            if (!options.value || !options.EN ||!options.AR) {
                alert('Fields cant bee empty!! ');
                return;
            }

            $(treeDiv).find('#nodeName' + nodeAddress).text(options.value);
            treeDiv.find('#treeValue').val('');
            treeDiv.find('#treeEN').val('');
            treeDiv.find('#treeAR').val('');


            e.preventDefault();
            e.stopPropagation();

            saveTreeNode(nodeAddress,options);

            console.log('nodeAddress: ', nodeAddress);
        },

        selectTreeNodeGetInfo: function (e) {
            var el = $(e.currentTarget);
            var treeDiv = $(this.$el).find('#treeDiv');
            var nodeAddress = el.attr('data-hash');
            var nodeOptions;

            e.preventDefault();
            e.stopPropagation();

            //TODO check MainObj if exist information
            //TODO write this info in #saveNode | #treeNodeInfo | #treeValue | #treeEN | #treeAR
            nodeOptions = readTreeNode(nodeAddress);
            //nodeOptions = $(treeDiv).find('#nodeName' + nodeAddress).text();

            $(treeDiv).find('#saveNode').attr('data-hash', nodeAddress);
            $(treeDiv).find('#treeValue').val(nodeOptions.value);
            $(treeDiv).find('#treeEN').val(nodeOptions.EN);
            $(treeDiv).find('#treeAR').val(nodeOptions.AR);

            console.log('nodeAddress: ', nodeAddress);
        },

        treeAddNodeItem: function (e) {
            var el = $(e.currentTarget);
            //var treeUl = $('#treeList');
            //console.dir($($(el.parent()[0]).parents("ul"))[0]);
            var newTreeUl = $("<ul> </ul>");
            var nodeAddress = $(el.parent()[0]).attr('data-hash');
            var treeNodeAddress = nodeAddress.split('_');
            var lastNodeAddress;
            var newNodeAddress;
            var currentNodeCount = treeNodeCounts[treeNodeAddress.length];
            var newTreeNodeAddress;
            // check if olredy has <ul>

            var searchChildrenUl = $(el.parent()[0]).parent().children("ul");
            //console.log('searchChildrenUl.length: ', searchChildrenUl.length);

            if (treeNodeAddress.length === 5) {
                alert('Available only 5 steps in depth!');
                return;
            }

            if (searchChildrenUl.length) {
                newTreeUl = $(searchChildrenUl[0]);
            }

            e.preventDefault();
            e.stopPropagation();

            treeNodeAddress[treeNodeAddress.length] = currentNodeCount;
            treeNodeCounts[treeNodeAddress.length - 1]++;
            newNodeAddress = treeNodeAddress.join('_');

            //currentTreeUl.find('#nodeLi' + lastNodeAddress).after(_.template(treeNodeTemplate)({
            newTreeUl.append(_.template(treeNodeTemplate)({
                node: {
                    address: newNodeAddress,
                    value: 'Node ' + newNodeAddress
                }
            }));

            if (!searchChildrenUl.length) {
                el.parent().parent().append(newTreeUl);
            }

            initializeTreeNode(newNodeAddress,'Node ' + newNodeAddress);

            console.log('nodeAddress: ', nodeAddress);
            console.log('treeNodeAddress: ', treeNodeAddress);
            console.log('treeNodeCounts: ', treeNodeCounts);
        },

        treeExpandNode: function (e) {
            var el = $(e.currentTarget);

            e.preventDefault();
            e.stopPropagation();

            $(el).toggle();
            $(el).next().toggle();
            $(el).parent().parent().children().last().toggle();
            //console.dir(el);
        },

        treeCollapseNode: function (e) {
            var el = $(e.currentTarget);

            e.preventDefault();
            e.stopPropagation();

            $(el).toggle();
            $(el).prev().toggle();
            $(el).parent().parent().children().last().toggle();
            //console.dir(el);
        },

        searchSelectIcon: function (e) {
            e.preventDefault();
            e.stopPropagation();

            searchIconTerm = $(e.target).val();
            console.log('searchSelectIcon: ', searchIconTerm);
            this.showSelectIcon();
        },

        preSelectIcon: function (e) {
            var iconId = $(e.currentTarget).attr('data-hash');

            e.preventDefault();
            e.stopPropagation();

            selectedIcon = iconsCollection.toJSON()[iconId];
            console.log('preSelectIcon clicked', iconId);
            selectIconDiv.find('#selectedIcon').text(selectedIcon.title);
        },

        closeSelectIcon: function (e) {
            //console.log('Close clicked');
            e.preventDefault();
            e.stopPropagation();

            selectIconDiv.hide();
        },

        selectIcon: function (e) {
            console.log('selectIcon clicked');
            e.preventDefault();
            e.stopPropagation();

            if (selectedIcon) {
                $('#icon').attr('src', selectedIcon['@2x']);
                $('#icon').attr('data-hash', selectedIcon._id);
                selectIconDiv.hide();
            }
        },

        showSelectIcon: function (e) {
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

            iconsCollection.fetch({
                data: data,
                success: function () {

                    console.dir('Loaded iconsCollection: ', iconsCollection.toJSON());

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
                error: function (err, xhr, model) {
                    alert(xhr);
                }
            });

            function updateIconList() {
                iconList = selectIconDiv.find('#iconList');
                iconList.html('');

                for (var i = 0, l = iconsCollection.length - 1; i <= l; i++) {
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


        changeMobileLanguage: function (e) {
            var lang = this.$el.find(e.target).attr('data-hash');
            console.log('change language clicked');
            language = lang ? lang : language;
            this.showMobileDisplay();
        },

        changePageOnMobile: function (e) {
            var operation = this.$el.find(e.target).attr('data-page');

            console.log('change mobile page  clicked, operation: ', operation);

            if (operation == 'dec' && currentMobilePage > 0) {
                currentMobilePage--
            }

            if (operation == 'inc' && currentMobilePage < pageBlockCount - 1) {
                currentMobilePage++
            }

            this.showMobileDisplay();
        },

        showSelectedItem: function (e) {
            var el = this.$el;
            var id = $(e.currentTarget).attr('data-hash');


            if (navigator.userAgent.search("Safari") >= 0) {
                $('body').animate({scrollTop: $('#' + id).offset().top}, 1100);
            } else {
                $('html').animate({scrollTop: $('#' + id).offset().top}, 1100);
            }
        },

        checkSelected: function (e) {
            var el = this.$el;
            var item = $(e.target).attr('data-hash');
            var mobilePage = $(e.target).attr('data-page');
            //var testEl = el.find('#page' + mobilePage +'itemBlock' + item + '  .treeBtn');
            //console.dir(testEl);

            if (e.target.value === 'tree') {
                el.find('#page' + mobilePage + 'itemBlock' + item + '  .showTreeBtn').show();
            } else {
                el.find('#page' + mobilePage + 'itemBlock' + item + '  .showTreeBtn').hide();
            }

            if (e.target.value === 'picker' || e.target.value === 'table') {
                el.find('#page' + mobilePage + 'itemBlockInputDataSource' + item).show();

            } else {
                el.find('#page' + mobilePage + 'itemBlockInputDataSource' + item).hide();
            }
            console.log('select: ', e.target.value, ' page:', mobilePage, ' item: ', item);
        },

        hideMobileDisplay: function () {
            var el = this.$el;
            el.find('#mobilePhone').hide();
            el.find('#mobileDisplay').hide();
        },


        saveTreeAndClose: function (e) {
            var el = this.$el;
            var item = $(e.target).parent().attr('data-item');
            var mobilePage = $(e.target).parent().attr('data-page');
            var treeList = el.find('#treeDiv').find('#treeList');

            // TODO Normalize currentNodeValues
            currentNodeValues.items =_.compact(currentNodeValues.items);

            // TODO validate if there are empty fields

            pagesTreeNodesValues['page' + mobilePage + 'item' + item] = currentNodeValues;

            treeNodeCounts = [1, 0, 0, 0, 0];
            //TODO change this to {}
            currentNodeValues = [returnNewTreeNodeObject('Node 0')];

            $(treeList).empty();
            el.find('#treeDiv').hide();
        },

        showTreeBlock: function (e) {
            var el = this.$el;
            var item = $(e.target).parent().attr('data-item');
            var mobilePage = $(e.target).parent().attr('data-page');
            var treeList = el.find('#treeDiv').find('#treeList');


            if (!pagesTreeNodesValues['page' + mobilePage + 'item' + item]) {
                pagesTreeNodesValues['page' + mobilePage + 'item' + item] = returnNewTreeNodeObject('Node 0');
            }

            $(treeList).empty();
            this.addNodesToTreeByObj( pagesTreeNodesValues['page' + mobilePage + 'item' + item], treeList,0);
            el.find('#treeDiv').attr('data-item',item).attr('data-page',mobilePage).show();
        },


        addNodesToTreeByObj: function (treeObj, treeList, nodeAddress) {
            // TODO make recursive function reading treeObj and add Nodes on tree
            treeList.append(_.template(treeNodeTemplate)({
                node: {
                    address: nodeAddress,
                    value: treeObj.value
                }
            }));

        },

        hideTreeBlock: function (e) {
            //TODO make block empty
            var el = this.$el;
            var item = $(e.target).attr('data-item');
            //var mobilePage = $(e.target).attr('data-page');
            var tree = el.find('#treeDiv');
            ////tree.
            //    empty().
            //    remove();

            tree.hide();
        },


        showMobileDisplay: function () {
            var el = this.$el;
            var data = this.readInputsAndValidate();
            var display = el.find('#mobileDisplay');
            var displayContent = "";
            var tempObj;
            var tempOrder;
            var inputElements;
            el.find('#currentPage').text(' Page[' + currentMobilePage + '] ');

            console.dir('rided data', data);
            console.log('rided data2', data);

            if (data === 'error') {
                return this;
            }
            displayContent += '<div style="margin-top:15px; color: white; font-weight: bold; font-size: 1.2em">' + data.profile.Name[language].toUpperCase() + '</div>';
            displayContent += '<div style="margin-top:15px; margin-bottom:18px; margin-left: 2px"><img src = "' + (data.icon ? '/icon/' + data.icon + '/@2x"' : '"') + ' style="width: 64px; height: 64px; -webkit-filter: brightness() invert();"></div>';
            displayContent += '<div style="color: white;font-size: 1.2em">' + data.profile.Name[language] + (language == 'AR' ? ' \u0623\u062f\u0648\u0627\u062a' : ' Service') + ' </div>';
            displayContent += '<br>';
            displayContent += '<div style = "margin-left: 50px; margin-right: 47px; height:360px; overflow-y: auto">';
            console.log('data before sorting', data);

            inputElements = data.pages[currentMobilePage].inputItems;
            console.log(' before sorting data.inputItems.length - 1', inputElements.length - 1);

            //http://jsperf.com/array-sort-vs-lodash-sort/2
            inputElements.sort(function compare(a, b) {
                if (a.order < b.order) return 1;
                if (a.order > b.order) return -1;
                return 0;
            });

            console.log('data after sorting', data);

            for (var i = inputElements.length - 1; i >= 0; i--) {
                displayContent += '<div class="showArea' + language + '" data-hash="page' + currentMobilePage + 'itemBlockOrder' + inputElements[i].displayOrder + '">';

                if (inputElements[i].inputType === 'file') {
                    displayContent += '<div style="color: lightslategray;">' + inputElements[i].displayName[language] + ' <img src="../img/attachSmall.png"></div>';
                } else {

                    displayContent += '<div style="color: lightslategray; ">' + inputElements[i].displayName[language] + '</div>';

                    if (inputElements[i].inputType === 'string' || inputElements[i].inputType === 'number' || inputElements[i].inputType === 'boolean') {
                        displayContent += '<div style="color: black; border-bottom: 1px solid gray; width: 100%; height: 20px ">' + inputElements[i].placeHolder[language] + '</div>';
                    }

                    if (inputElements[i].inputType === 'picker') {
                        displayContent += '<div style="color: black; border-bottom: 1px solid gray; width: 100%">' + (inputElements[i].dataSource ? inputElements[i].dataSource[0][language] : '') + ' &#x25bc</div>';
                    }


                    if (inputElements[i].inputType === 'text') {
                        displayContent += '<div style="width: 100%; height: 55px; border: 1px solid grey;background-color: ghostwhite; opacity: 0.5;">' + inputElements[i].placeHolder[language] + '</div>';
                    }
                }
                displayContent += '</div>';
            }
            if (currentMobilePage === pageBlockCount - 1) {
                displayContent += '<div  class="showArea' + language + '" data-hash="buttonTitleEN" style=" margin-top: 3px; text-align: center">';
                displayContent += '<span style="min-height: 20px; border: 1px solid grey;min-width: 50px; background-color: ghostwhite; opacity: 0.7;  border-radius: 6px; display: inline-block;"> ' + data.buttonTitle[language] + ' </span>';
                displayContent += '</div>';
            }
            displayContent += '</div>';


            el.find('#mobilePhone').css({
                "background": "url('../img/mobile.jpg')",
                "background-size": "100% 100%"
            }).show();
            display.html(displayContent).show();
            //console.log('displayContent:',displayContent);
        },

        addProfileFieldBlock: function (e) {

            var textContent = '<td><b>profile.</b><input type="text" name="" id="profileFieldName' + profileBlockCount + '" size="10" maxlength="20"></td><td><input type="text" name="" id="profileFieldValue' + profileBlockCount + '" size="20" maxlength="40"></td><td> Input profile. fileds name and fields value </td>';

            $("<tr> </tr>").
                attr("id", "profileFieldBlock" + profileBlockCount).
                html(textContent).
                insertBefore("#profileBlock");

            profileBlockCount++;
        },

        delProfileFieldBlock: function (e) {

            if (profileBlockCount === 0) {
                return;
            }
            profileBlockCount--;

            $("#profileFieldBlock" + profileBlockCount).
                remove();
        },

        addPageBlock: function (e) {
            var el = this.$el;

            e.preventDefault();
            e.stopPropagation();

            el.find("#pagesBlock").before(_.template(pagesBlockTemplate)({pageBlockCount: pageBlockCount}));

            itemBlockCount[pageBlockCount] = 0;
            pageBlockCount++;
        },

        showBlock: function (e) {
            var el = this.$el;
            var blockClassName = $(e.target).attr('data-hash');

            e.preventDefault();
            e.stopPropagation();

            el.find("." + blockClassName).show();
            console.log("preesed  show: ", blockClassName)
        },

        hideBlock: function (e) {
            var el = this.$el;
            var blockClassName = $(e.target).attr('data-hash');

            e.preventDefault();
            e.stopPropagation();

            el.find("." + blockClassName).hide();
            console.log("preesed  hide: ", blockClassName)
        },

        addInputItemsBlock: function (e) {
            var el = this.$el;
            var page = +($(e.target).attr('data-page'));

            e.preventDefault();
            e.stopPropagation();

            el.find("#itemBlockPage" + page).before(_.template(inputBlockTemplate)({
                i: itemBlockCount[page],
                page: page
            }));

            itemBlockCount[page]++;
            console.log('itemBlockCount[', page, ']: ', itemBlockCount[page]);
        },

        delInputItemsBlock: function (e) {
            var el = this.$el;
            var page = $(e.target).attr('data-page');

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            if (!itemBlockCount[page] || itemBlockCount[page] === 0) {
                return this;
            }

            itemBlockCount[page]--;
            el.find("#page" + page + "itemBlock" + itemBlockCount[page]).
                empty().
                remove();

            console.log('itemBlockCount[', page, ']: ', itemBlockCount[page]);
            this.updateItemsInputNameArray();
        },

        enableInput: function (e) {
            var idName = e.target.id;
            var el = this.$el;

            if (e.target.checked) {
                el.find('#' + idName + 'Show').show();
            } else {
                el.find('#' + idName + 'Show').hide();
            }

        },

        readInputsAndValidate: function () {
            var el = this.$el;
            var errors = [];
            var data = {};
            var pageID = '';
            var tempText;
            var tempText2;

            data.serviceProvider = el.find('#serviceProvider').val().trim();
            data.enable = el.find('#serviceEnable')[0].checked;

            data.buttonTitle = {
                EN: el.find('#buttonTitleEN').val().trim(),
                AR: el.find('#buttonTitleAR').val().trim()
            };

            data.url = el.find('#url').val().trim();
            data.icon = el.find('#icon').attr('data-hash');
            data.icon = data.icon ? data.icon : null;

            data.forUserType = [];
            el.find('#guest')[0].checked ? data.forUserType.push('guest') : undefined;
            el.find('#client')[0].checked ? data.forUserType.push('client') : undefined;
            el.find('#admin')[0].checked ? data.forUserType.push('admin') : undefined;
            el.find('#company')[0].checked ? data.forUserType.push('company') : undefined;
            el.find('#government')[0].checked ? data.forUserType.push('government') : undefined;

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

            data.pages = [];

            // TODO add check if empty and .trim()

            for (var j = 0; j <= pageBlockCount - 1; j++) {
                pageID = '#page' + j;
                data.pages[j] = {
                    inputItems: []
                };

                for (var i = itemBlockCount[j] - 1; i >= 0; i--) {
                    data.pages[j].inputItems[i] = {
                        inputType: el.find(pageID + 'inputType' + i).val(),
                        name: el.find(pageID + 'name' + i).val().trim(),
                        order: el.find(pageID + 'order' + i).val().trim(),
                        displayName: {
                            EN: el.find(pageID + 'displayNameEN' + i).val(),
                            AR: el.find(pageID + 'displayNameAR' + i).val()
                        },
                        placeHolder: {
                            EN: el.find(pageID + 'placeHolderEN' + i).val(),
                            AR: el.find(pageID + 'placeHolderAR' + i).val()
                        },
                        required: el.find(pageID + 'requiredCheck' + i)[0].checked,
                        validateAs: el.find(pageID + 'inputValidate' + i).val(),
                        dataSource: sendParams[pageID + 'inputDataSource' + i],
                        displayOrder: i
                    }
                }
            }

            if (profileBlockCount > 0) {
                data.profile = {};

                for (var i = profileBlockCount - 1; i >= 0; i--) {
                    tempText = el.find('#profileFieldNameEN' + i).val();
                    tempText = tempText ? tempText.trim() : '';


                    tempText2 = el.find('#profileFieldValueEN' + i).val();
                    tempText2 = tempText2 ? tempText2.trim() : '';

                    if (!tempText || !tempText2) {
                        alert('Fields in profile cant be Empty !!!');
                        return;
                    }

                    data.profile[tempText] = {EN: tempText2};

                    tempText = el.find('#profileFieldNameAR' + i).val();
                    tempText = tempText ? tempText.trim() : '';

                    tempText2 = el.find('#profileFieldValueAR' + i).val();
                    tempText2 = tempText2 ? tempText2.trim() : '';

                    if (!tempText || !tempText2) {
                        alert('Fields in profile cant be Empty !!!');
                        return;
                    }

                    data.profile[tempText].AR = tempText2;
                }
            }
            console.dir(data);

            Validation.checkUrlField(errors, true, data.url, 'Base Url');
            Validation.checkCompanyNameField(errors, true, data.serviceProvider, 'serviceProvider');

            if (errors.length) {
                alert(errors);
                return 'error';
            }

            return data;
        },

        updateService: function (e) {
            var model = new ServiceModel();
            var data = this.readInputsAndValidate();
            console.dir('saved data ', data);

            if (data !== 'error') {
                if (cloneService || isNewService) {
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

        addItemToArray: function (e) {
            var el = this.$el;
            var paramsRequest = $(e.target).attr('data-hash');
            var pageNumber = $(e.target).attr('data-page');
            var itemNumber = $(e.target).attr('data-item');
            var inputFieldName;
            var dataSourceId = '#page' + pageNumber + 'inputDataSource' + itemNumber;
            var inputFieldValue;
            var inputFieldEN;
            var inputFieldAR;

            console.log('addButtonClicked pageNumber', pageNumber, 'itemNumber: ', itemNumber);

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            if (paramsRequest) {
                inputFieldName = el.find('#' + paramsRequest + 'Input').val();

                if (!sendParams[paramsRequest]) {
                    sendParams[paramsRequest] = []
                }

                if (!el.find('#' + paramsRequest)[0].checked || !inputFieldName || sendParams[paramsRequest].indexOf(inputFieldName) >= 0) {
                    return this;
                }

                sendParams[paramsRequest].push(el.find('#' + paramsRequest + 'Input').val().trim());
                el.find('#' + paramsRequest + 'Value').text(sendParams[paramsRequest]);
                console.log(paramsRequest, ' ', sendParams[paramsRequest]);

                return this;
            }

            if (pageNumber && itemNumber) {

                inputFieldValue = el.find(dataSourceId + 'Value').val().trim();
                inputFieldEN = el.find(dataSourceId + 'EN').val().trim();
                inputFieldAR = el.find(dataSourceId + 'AR').val().trim();

                if (!inputFieldAR || !inputFieldEN || !inputFieldAR) {
                    alert('Fill all inputs. ' + (!inputFieldValue ? ' Value ' : '') + (!inputFieldEN ? ' EN ' : '') + (!inputFieldAR ? ' AR ' : '') + ' - Empty');

                    return;
                }

                inputFieldName = {
                    value: inputFieldValue,
                    EN: inputFieldEN,
                    AR: inputFieldAR
                };

                if (!sendParams[dataSourceId]) {
                    sendParams[dataSourceId] = []
                }

                sendParams[dataSourceId].push(inputFieldName);

                el.find('#page' + pageNumber + 'dataSourceValue' + itemNumber).text(JSON.stringify(sendParams[dataSourceId]));

                el.find(dataSourceId + 'Value').val('');
                el.find(dataSourceId + 'EN').val('');
                el.find(dataSourceId + 'AR').val('');

            }
        },

        dellLastItemFromArray: function (e) {
            var el = this.$el;
            var paramsRequest = $(e.target).attr('data-hash');
            var pageNumber = $(e.target).attr('data-page');
            var itemNumber = $(e.target).attr('data-item');
            var dataSourceId = '#page' + pageNumber + 'inputDataSource' + itemNumber;

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            console.log('dellButtonClicked');

            if (paramsRequest) {

                if (!el.find('#' + paramsRequest)[0].checked || !sendParams[paramsRequest].length) {
                    return;
                }

                sendParams[paramsRequest].pop();
                el.find('#' + paramsRequest + 'Value').text(sendParams[paramsRequest]);
            }

            if (pageNumber && itemNumber) {

                sendParams[dataSourceId].pop();
                el.find('#page' + pageNumber + 'dataSourceValue' + itemNumber).text(JSON.stringify(sendParams[dataSourceId]));
            }
        },

        updateItemsInputNameArray: function () {
            var el = this.$el;
            var newOptionsValue = '';
            var value = '';

            itemsInputNameArray = [];

            for (var j = pageBlockCount - 1; j >= 0; j--) {
                for (var i = itemBlockCount[j] - 1; i >= 0; i--) {
                    value = el.find('#page' + j + 'name' + i).val().trim();

                    if (value) {
                        itemsInputNameArray.push(value);
                        newOptionsValue = '<option>' + value + '</option>' + newOptionsValue;
                    }
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
            var inpuItems;
            var pageID;
            var defaultService = {
                serviceProvider: 'DefaultRest',
                'profile': {
                    'Terms and conditions': {
                        'AR': '',
                        'EN': ''
                    },
                    'Service fee': {
                        'AR': '',
                        'EN': ''
                    },
                    'Required documents': {
                        'AR': '',
                        'EN': ''
                    },
                    'Officer in charge of this service': {
                        'AR': '',
                        'EN': ''
                    },
                    'Expected time': {
                        'AR': '',
                        'EN': ''
                    },
                    'Service Package': {
                        'AR': '',
                        'EN': ''
                    },
                    'About the service': {
                        'AR': '',
                        'EN': ''
                    },
                    'Name': {
                        'AR': '',
                        'EN': ''
                    }
                },
                buttonTitle: {
                    EN: '',
                    AR: ''
                },
                forUserType: 'client',
                params: {}
            };

            if (isNewService || !App.selectedService) {
                console.log('isNewService: ', isNewService);
                //el.html(_.template(createTemplate));
                el.html(this.template({service: defaultService}));
                service = defaultService

            } else {
                service = App.selectedService.toJSON();
            }

            service.port = service.port || undefined;
            service.profile = service.profile || undefined;

            console.dir(service);

            el.html(this.template({service: service}));

            profileBlockCount = service.profile ? Object.keys(service.profile).length : 0;
            sendParams = service.params;
            pageBlockCount = service.pages ? service.pages.length : 0;
            itemBlockCount = [0];

            console.log(itemBlockCount);
            for (var j = 0; j <= pageBlockCount - 1; j++) {

                el.find("#pagesBlock").before(_.template(pagesBlockTemplate)({pageBlockCount: j}));
                console.dir(service.pages[j]);
                itemBlockCount[j] = service.pages[j].inputItems.length;
                pageID = '#page' + j;
                inpuItems = service.pages[j].inputItems;

                for (var i = 0; i <= itemBlockCount[j] - 1; i++) {

                    itemTempTemplate = $(_.template(inputBlockTemplate)({i: i, page: j}));
                    itemTempTemplate.find(pageID + 'inputType' + i).val(inpuItems[i].inputType);
                    itemTempTemplate.find(pageID + 'name' + i).val(inpuItems[i].name);
                    itemTempTemplate.find(pageID + 'order' + i).val(inpuItems[i].order);

                    itemTempTemplate.find(pageID + 'displayNameEN' + i).val(inpuItems[i].displayName ? inpuItems[i].displayName.EN : '');
                    itemTempTemplate.find(pageID + 'displayNameAR' + i).val(inpuItems[i].displayName ? inpuItems[i].displayName.AR : '');
                    itemTempTemplate.find(pageID + 'placeHolderEN' + i).val(inpuItems[i].placeHolder ? inpuItems[i].placeHolder.EN : '');
                    itemTempTemplate.find(pageID + 'placeHolderAR' + i).val(inpuItems[i].placeHolder ? inpuItems[i].placeHolder.AR : '');
                    itemTempTemplate.find(pageID + 'requiredCheck' + i).prop('checked', inpuItems[i].required);
                    itemTempTemplate.find(pageID + 'inputValidate' + i).val(inpuItems[i].validateAs);

                    if (inpuItems[i].dataSource && inpuItems[i].dataSource.length) {
                        sendParams[pageID + 'inputDataSource' + i] = inpuItems[i].dataSource;
                        itemTempTemplate.find(pageID + 'dataSourceValue' + i).text(JSON.stringify(sendParams[pageID + 'inputDataSource' + i]));

                    }

                    if (inpuItems[i].inputType === 'picker' || inpuItems[i].inputType === 'table') {
                        itemTempTemplate.find(pageID + 'itemBlockInputDataSource' + i).show();
                    }

                    //console.log(typeof(itemTempTemplate), '  ', itemTempTemplate);
                    el.find("#itemBlockPage" + j).before(itemTempTemplate);
                }
            }

            el.find('#treeDiv').draggable({
                containment: "document"
            });
            el.find('#mobilePhone').draggable({
                containment: "document"
            });

            this.updateItemsInputNameArray();
            console.dir(sendParams);

            return this;
        }
    });

    return serviceUpdateView;
});