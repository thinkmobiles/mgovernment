
define([
    'text!templates/service/create.html',
    '../../models/service'
], function (content, ServiceModel) {
    var itemBlockCount = 0;
    var serviceCreateView = Backbone.View.extend({

        el: '#dataBlock',
        template: _.template(content),

        events: {
            'click #saveBtn' : 'saveService',
            'click #addInputItemsBlock' : 'addInputItemsBlock',
            'click #delInputItemsBlock' : 'delInputItemsBlock',
            'change .enabledCheckBox' : 'enableInput'
        },

        initialize: function () {
            itemBlockCount = 0;
            this.render();
        },



        addInputItemsBlock: function(e) {
            var textContent;

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            textContent = '<td class = "hiddenByDefault"><b>item[' + itemBlockCount + '].order:</b></td>  <td class = "hiddenByDefault"><input type="number" id="order' + itemBlockCount + '" size ="4" style="width: 50px"></td><td class = "hiddenByDefault"> Input order of item[' + itemBlockCount + ']: </td>';

            $("<tr> </tr>").
                attr("id", "itemBlockOrder" + itemBlockCount).
                html(textContent).
                insertBefore("#itemBlock");

            textContent = '<td class = "hiddenByDefault"><b>item[' + itemBlockCount + '].name:</b></td>  <td class = "hiddenByDefault"><input type="text" id="name' + itemBlockCount + '" size="20" maxlength="20"></td><td class = "hiddenByDefault"> Input name of item[' + itemBlockCount + ']: </td>';

            $("<tr> </tr>").
                attr("id", "itemBlockName" + itemBlockCount).
                html(textContent).
                insertBefore("#itemBlock");

            textContent = '<td class = "hiddenByDefault"><b>item[' + itemBlockCount + '].type:</b></td>  <td class = "hiddenByDefault"> <select id = "inputType' + itemBlockCount + '">' +
                '<option value="string">string</option>' +
                '<option value="number">number</option>' +
                '<option value="boolean">boolean</option>' +
                '<option value="file">file</option>' +
                '</select></td><td class = "hiddenByDefault"> Input type of of item[' + itemBlockCount + ']: </td>';

            $("<tr> </tr>").
                attr("id", "itemBlockInputType" + itemBlockCount).
                html(textContent).
                insertBefore("#itemBlock");

            itemBlockCount++;
        },

        delInputItemsBlock: function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            if (itemBlockCount == 0) {
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
            console.log(idName,'(e.target.checked) ',e.target.checked,'#'+ idName + 'Input' );

            if (e.target.checked) {
                el.find('#'+ idName + 'Input').prop( "disabled", false );
            } else {
                el.find('#'+ idName + 'Input').prop( "disabled", true );
            }


        },

        saveService: function(e){
            var el = this.$el;
            var model = new ServiceModel();
            var data ={};

            data.serviceProvider = el.find('#serviceProvider').val();
            data.serviceName = el.find('#serviceName').val();
            data.serviceType = el.find('#serviceType').val();
            data.profile = {
                description: el.find('#description').val()
            };
            data.baseUrl = el.find('#baseUrl').val();

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
                data.params.uriSpecQuery = el.find('#uriSpecQueryInput').val().trim().split(',');
            }

            if (el.find('#body')[0].checked) {
                data.params.body = el.find('#bodyInput').val().trim().split(',');
            }

            if (el.find('#query')[0].checked) {
                data.params.query = el.find('#queryInput').val().trim().split(',');
            }

            data.inputItems =[];

            for (var i = itemBlockCount - 1; i >= 0; i-- ){
                data.inputItems[i]= {
                    inputType: el.find('#inputType' + i).val(),
                    name: el.find('#name' + i).val(),
                    order: el.find('#order' + i).val()
                }
            }

            console.dir(data);

            model.save(data, {
                success: function(model, response){
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('services', {trigger: true});
                    console.log('Success created');
                    console.log(model);
                    console.log(response);
                    alert(model);

                },
                error: function(err, xhr, model, response){
                    console.log('Error created',xhr);
                    alert(xhr.responseText);
                }
            });
        },

        render: function () {
            this.$el.html(this.template());
            return this;
        }
    });
    return serviceCreateView;
});


