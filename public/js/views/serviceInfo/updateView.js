define([
    'text!templates/serviceInfo/update.html',
    'models/serviceInfo'

], function (content, ServiceModel) {
    'use strict';

    var serviceInfoUpdateView = Backbone.View.extend({
        el: '#dataBlock',
        template: _.template(content),

        events: {
            'click #updateBtn': 'updateService'
        },

        initialize: function () {
            this.render();
        },

        updateService: function (e) {
            var data = this.readInputsAndValidate();
            var model = new ServiceModel();
            if (data !== 'error') {
                App.selectedService.save(data,{
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

        readInputsAndValidate: function () {
            var el = this.$el;
            var errors = [];
            var data = {};
            var profileBlockCount = 8;
            var tempText;
            var tempText2;

            // TODO add check if empty and .trim()
            data.profile = {};
                for (var i = profileBlockCount - 1; i >= 0; i--) {
                    tempText = el.find('#profileFieldNameEN' + i).val();
                    tempText = tempText ? tempText.trim() : '';


                    tempText2 = el.find('#profileFieldValueEN' + i).val();
                    tempText2 = tempText2 ? tempText2.trim() : '';

                    if (!tempText || !tempText2) {
                        alert('Fields in profile cant be Empty !!!');
                        return 'error';
                    }

                    data.profile[tempText] = {EN: tempText2};

                    tempText = el.find('#profileFieldNameAR' + i).val();
                    tempText = tempText ? tempText.trim() : '';

                    tempText2 = el.find('#profileFieldValueAR' + i).val();
                    tempText2 = tempText2 ? tempText2.trim() : '';

                    if (!tempText || !tempText2) {
                        alert('Fields in profile cant be Empty !!!');
                        return 'error';
                    }

                    data.profile[tempText].AR = tempText2;
                }
            console.dir(data);

            if (errors.length) {
                alert(errors);
                return 'error';
            }

            return data;
        },

        render: function () {
            var service = App.selectedService.toJSON();
            console.log(service.serviceName);
            var el = this.$el;
            el.html(this.template({service: service}));

            return this;
        }
    });

    return serviceInfoUpdateView;
});