var CONST = require('../../constants/index');

module.exports = {

    DYNAMIC_COMPLAIN_TRA: {
        serviceProvider: CONST.SERVICE_PROVIDERS.DEFAULT_REST,
        serviceName: {
            EN: 'Dynamic Complain TRA',
            AR: 'Dynamic شكوى على الهيئة'
        },
        profile: {
            'Name': {
                EN: 'Dynamic Complain TRA',
                AR: 'Dynamic شكوى على الهيئة'
            },
            'About the service': {
                EN: 'You can file a complaint or put remarks about your telecom service provider',
                AR: ''
            },
            'Service Package': {
                EN: '.',
                AR: ''
            },
            'Expected time': {
                EN: 'Within 3 working days; could take more time based on the subject of the complaint',
                AR: ''
            },
            'Officer in charge of this service': {
                EN: 'Call center administrator',
                AR: ''
            },
            'Required documents': {
                EN: 'None',
                AR: ''
            },
            'Service fee': {
                EN: 'None',
                AR: ''
            },
            'Terms and conditions': {
                EN: 'Applicant information',
                AR: ''
            }
        },
        icon: null,

        url: 'http://mobws.tra.gov.ae/complainTRAService',
        method: CONST.SERVICE_METHOD.POST,
        params: {
            body: ['title', 'description', 'attachment']
        },
        port: null,

        needAuth: true,
        forUserType: [CONST.USER_TYPE.CLIENT],

        buttonTitle: {
            EN: 'Send Complain',
            AR: 'شكوى على الهيئة'
        },

        pages: [
            {
                number: 0,
                inputItems: [
                    {
                        order: 0,
                        name: 'title',
                        inputType: CONST.SERVICE_INPUT_TYPE.STRING,
                        placeHolder: {
                            EN: 'write here',
                            AR: 'AR write here'
                        },
                        displayName: {
                            EN: 'title',
                            AR: 'title'
                        },
                        required: true,
                        validateAs: CONST.SERVICE_VALIDATE_TYPE.STRING
                    },
                    {
                        order: 1,
                        name: 'description',
                        inputType: CONST.SERVICE_INPUT_TYPE.TEXT,
                        placeHolder: {
                            EN: 'your description',
                            AR: 'AR your description'
                        },
                        displayName: {
                            EN: 'message',
                            AR: 'AR message'
                        },
                        required: true,
                        validateAs: CONST.SERVICE_VALIDATE_TYPE.STRING
                    }
                ]
            },
            {
                number: 1,
                inputItems: [
                    {
                        order: 0,
                        name: 'attachment',
                        inputType: CONST.SERVICE_INPUT_TYPE.FILE,
                        placeHolder: {
                            EN: 'some image',
                            AR: 'AR some image'
                        },
                        displayName: {
                            EN: 'attachment',
                            AR: 'AR attachment'
                        },
                        required: false,
                        validateAs: CONST.SERVICE_VALIDATE_TYPE.NONE
                    }
                ]
            }
        ]
    },

    DYNAMIC_DOMAIN_WHOIS: {
        serviceProvider: CONST.SERVICE_PROVIDERS.DEFAULT_REST,
        serviceName: {
            EN: 'Dynamic Domain WHOIS',
            AR: 'Dynamic تحقق من نطاق'
        },
        profile: {
            'Name': {
                EN: 'Dynamic Domain WHOIS',
                AR: 'Dynamic تحقق من نطاق'
            },
            'About the service': {
                EN: 'You can file a complaint or put remarks about your telecom service provider',
                AR: ''
            },
            'Service Package': {
                EN: '.',
                AR: ''
            },
            'Expected time': {
                EN: 'Within 3 working days; could take more time based on the subject of the complaint',
                AR: ''
            },
            'Officer in charge of this service': {
                EN: 'Call center administrator',
                AR: ''
            },
            'Required documents': {
                EN: 'None',
                AR: ''
            },
            'Service fee': {
                EN: 'None',
                AR: ''
            },
            'Terms and conditions': {
                EN: 'Applicant information',
                AR: ''
            }
        },
        icon: null,

        url: 'http://mobws.tra.gov.ae/checkWhois',
        method: CONST.SERVICE_METHOD.GET,
        params: {
            query: ['checkUrl']
        },
        port: null,

        needAuth: false,
        forUserType: [CONST.USER_TYPE.CLIENT],

        buttonTitle: {
            EN: 'WHOIS',
            AR: 'تحقق من نطاق'
        },

        pages: [
            {
                number: 0,
                inputItems: [
                    {
                        order: 0,
                        name: 'checkUrl',
                        inputType: CONST.SERVICE_INPUT_TYPE.STRING,
                        placeHolder: {
                            EN: 'Insert Domain name here',
                            AR: 'AR Insert Domain name here'
                        },
                        displayName: {
                            EN: '',
                            AR: ''
                        },
                        required: true,
                        validateAs: CONST.SERVICE_VALIDATE_TYPE.URL
                    }
                ]
            }
        ]
    }

};