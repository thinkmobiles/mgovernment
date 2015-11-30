define([
    'text!templates/iconsViewTemplate.html',
    'collections/icons',
    'models/icon',
    'text!templates/pagination/paginationTemplate.html',
    'views/customElements/paginationView'
],function(content, IconsCollection, IconModel, paginationTemplate, PaginationView){
    'use strict';

    var propertyList = '';
    var properties = '';
    var iconPropertyDiv$;
    var updatedImages = [];
    var iconsView = Backbone.View.extend({

        el: '#dataBlock',
        events: {
            'click .iconList': 'showIconsInfo',
            'click #createIcon': 'createIcon',
            'click #deleteIcon': 'deleteIcon',
            'click #save': 'saveIcon',
            'change .inputIcon' : 'loadImg',
            'keyup #searchTerm': "searchByTerm"
        },

        template: _.template(content),

        initialize: function(options){
            this.iconsCollection =  new IconsCollection();
            this.paginationView = new PaginationView({
                collection   : this.iconsCollection,
                countPerPage : options.countPerPage,
                url          : 'icon',
                urlGetCount  : this.iconsCollection.url + 'getCount',
                padding      : 2,
                page         : options.page,
                ends         : true,
                steps        : true,
                data         : {
                    type: '@3x',
                    searchTerm: options.searchTerm
                }
            });

            if (!options.searchTerm) {
                App.searchTerm = '';
            }

            this.listenTo(this.iconsCollection, 'reset remove', this.render);
            //this.render();
        },

        searchByTerm: function(e){
            var searchTerm =  e.target.value;

            App.searchTerm = searchTerm;

            console.log('serchTerm:',searchTerm);
            this.paginationView.setData({searchTerm: searchTerm,  type: '@3x'});

            //this.paginationView.setData({orderBy: sortBy, order: sortOrder, filter: filter, searchTerm: searchTerm});
        },

        loadImg: function(e){

            var id = e.target.id;
            var imageId = $(e.target).attr('data-hash');
            console.log('id = ',id ,'    imageId= ',imageId);
            console.dir(e);

            var file    =  e.target.files[0]; //sames as here
            var reader  = new FileReader();
            console.log('id = ',id ,'    imageId= ',imageId);

            reader.onloadend = function () {
                iconPropertyDiv$.find('#' + imageId).attr('src',reader.result);
                updatedImages.push(imageId);
            };

            if (file) {
                reader.readAsDataURL(file); //reads the data as a URL
            } else {
                // preview.src = "";
            }
        },

        createIcon: function(e){
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            this.selectedIconId = null;

            iconPropertyDiv$.hide();
            iconPropertyDiv$.find('#iconTitle').val('');
            iconPropertyDiv$.find('#i3x').attr ('src','');
            iconPropertyDiv$.find('#i2x').attr ('src','');
            iconPropertyDiv$.find('#ixxxhdpi').attr ('src','');
            iconPropertyDiv$.find('#ixxhdpi').attr ('src','');
            iconPropertyDiv$.find('#ixhdpi').attr ('src','');
            iconPropertyDiv$.find('#ihdpi').attr ('src','');
            iconPropertyDiv$.find('#imdpi').attr ('src','');
            iconPropertyDiv$.find('#save span').text('Save icons in DB');
            iconPropertyDiv$.show();
        },

        deleteIcon: function() {
            console.log('deleteIcon clicked');
            if (!this.selectedIconId) {
                return;
            }

            var icon = this.iconsCollection.models[this.selectedIconId];
            var self = this;

            icon.destroy ({
                success: function(model, response, options){
                    alert('Icon deleted');
                    self.iconsCollection.reset();
                },

                error: function(model, xhr, options){
                    alert(xhr);
                }
            });
        },

        saveIcon: function(e) {
            var model = new IconModel();
            var data = {};
            var errors = [];
            var self = this;

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            console.dir(iconPropertyDiv$.find('#i2x'));

            data.title = iconPropertyDiv$.find('#iconTitle').val();

            if (!this.selectedIconId || updatedImages.indexOf('i3x') >= 0) {
                data['@3x']= iconPropertyDiv$.find('#i3x').attr('src');
            }
            if (!this.selectedIconId || updatedImages.indexOf('i2x') >= 0) {
                data['@2x'] = iconPropertyDiv$.find('#i2x').attr('src');
            }
            if (!this.selectedIconId || updatedImages.indexOf('ixxxhdpi') >= 0) {
                data['xxxhdpi'] = iconPropertyDiv$.find('#ixxxhdpi').attr('src');
            }
            if (!this.selectedIconId || updatedImages.indexOf('ixxhdpi') >= 0) {
                data['xxhdpi'] = iconPropertyDiv$.find('#ixxhdpi').attr('src');
            }
            if (!this.selectedIconId || updatedImages.indexOf('ixhdpi') >= 0) {
                data['xhdpi'] = iconPropertyDiv$.find('#ixhdpi').attr('src');
            }
            if (!this.selectedIconId || updatedImages.indexOf('ihdpi') >= 0) {
                data['hdpi'] = iconPropertyDiv$.find('#ihdpi').attr('src');
            }
            if (!this.selectedIconId || updatedImages.indexOf('imdpi') >= 0) {
                data['mdpi'] = iconPropertyDiv$.find('#imdpi').attr('src');
            }

            _.forEach(data, function(value, key){
                if (!value) {
                    errors.push (key + ' can not bee emtpy');
                }
            });

            if (errors.length) {
                alert(errors);
                return this;
            }

            if (!this.selectedIconId) {

                model.save(data, {
                    success: function (model, response) {
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(Backbone.history.location.hash, {trigger: true});
                    },
                    error: function (err, xhr, model, response) {
                        console.log('Error updated', xhr);
                        alert(xhr.responseText);
                    }
                });
            } else {
                this.selectedIcon.save(data, {
                    success: function (model, response) {
                        self.paginationView.loadPage();
                     },
                    error: function (err, xhr, model, response) {
                        console.log('Error updated', xhr);
                        alert(xhr.responseText);
                    }
                });
            }
        },

        showIconsInfo: function(e){

            var id = $(e.currentTarget).attr('data-hash');
            var selectedIcon = this.iconsCollection.toJSON()[id];
            updatedImages = [];

            iconPropertyDiv$.hide();
            iconPropertyDiv$.find('#iconTitle').val(selectedIcon.title);
            iconPropertyDiv$.find('#i3x').attr ('src',selectedIcon['@3x']);
            iconPropertyDiv$.find('#ixxxhdpi').attr ('src','icon/' + selectedIcon._id + '/xxxhdpi');
            iconPropertyDiv$.find('#ixxhdpi').attr ('src','icon/' + selectedIcon._id + '/xxhdpi');
            iconPropertyDiv$.find('#ixhdpi').attr ('src','icon//' + selectedIcon._id + '/xhdpi');
            iconPropertyDiv$.find('#ihdpi').attr ('src','icon/' + selectedIcon._id + '/hdpi');
            iconPropertyDiv$.find('#imdpi').attr ('src','icon/' + selectedIcon._id + '/mdpi');
            iconPropertyDiv$.find('#i2x').attr ('src','icon/' + selectedIcon._id + '/@2x');
            iconPropertyDiv$.find('#save span').text('Update icons in DB');

            this.selectedIconId = id;
            iconPropertyDiv$.show();

            this.selectedIcon = this.iconsCollection.models[id];
        },

        updateIconList: function(){
            var iconsCollection = this.iconsCollection.toJSON();
            var textContent;
            var iconDiv;
            var iconId;
            var icon;

            console.log('updateIconList');

            for (var i = 0,l = iconsCollection.length-1; i <= l; i++){
                icon = iconsCollection[i];
                iconId = icon._id;
                iconDiv = $("#DbList" + iconId);
                textContent = '<div class="iconPreview"><span class="iconImg"><img src ="' + icon['@3x'] + '" /></span><span class="iconTitle">' + icon.title + '</span></div>';

                if (!iconDiv.length) {
                    $('<div> </div>').
                        attr("id", "DbList" + iconId).
                        attr("class", "iconList").
                        attr("data-hash", "" + i).
                        html(textContent).
                        appendTo("#databaseList");
                } else {
                    $("#DbList" + iconId).
                        attr("class", "DbList").
                        attr("data-hash", "" + i).
                        html(textContent);
                }
            }
        },

        render: function () {
            var el =  this.$el;

            console.log('IconsView render');

            el.html(this.template());
            el.find("#paginationDiv").html(this.paginationView.render().$el);

            iconPropertyDiv$ = el.find("#propertyList");
            propertyList =  $("#propertyList");
            properties = $("#properties");

            el.find("#searchTerm").val(App.searchTerm ? App.searchTerm:'').focus();
            this.updateIconList();
            return this;
        }
    });

    return iconsView;
});
