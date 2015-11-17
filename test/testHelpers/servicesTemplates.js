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
    },

    DYNAMIC_DOMAIN_WHOIS_TEST: {
        serviceProvider: CONST.SERVICE_PROVIDERS.DEFAULT_REST,
        serviceName: {
            EN: 'Dynamic TEST WHOIS',
            AR: 'Dynamic TEST تحقق من نطاق'
        },
        profile: {
            'Name': {
                EN: 'Dynamic TEST Domain WHOIS',
                AR: 'Dynamic TEST تحقق من نطاق'
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
            },
            {
                number: 1,
                inputItems: [
                    {
                        order: 0,
                        name: 'message',
                        inputType: CONST.SERVICE_INPUT_TYPE.TEXT,
                        placeHolder: {
                            EN: 'Insert message here',
                            AR: 'AR Insert message here'
                        },
                        displayName: {
                            EN: '',
                            AR: ''
                        },
                        required: false,
                        validateAs: CONST.SERVICE_VALIDATE_TYPE.NONE
                    }
                ]
            },
            {
                number: 2,
                inputItems: [
                    {
                        order: 0,
                        name: 'urltype',
                        inputType: CONST.SERVICE_INPUT_TYPE.PICKER,
                        dataSource: [
                            {value: 0, AR: 'al du', EN: 'du'},
                            {value: 1, AR: 'al Etisalat', EN: 'Etisalat'},
                            {value: 2, AR: 'al Yahsat', EN: 'Yahsat'}
                        ],
                        placeHolder: {
                            EN: 'Select Type',
                            AR: 'AR Select Type'
                        },
                        displayName: {
                            EN: '',
                            AR: ''
                        },
                        required: false,
                        validateAs: CONST.SERVICE_VALIDATE_TYPE.NONE
                    }
                ]
            },
            {
                number: 3,
                inputItems: [
                    {
                        order: 0,
                        name: 'dateDob',
                        inputType: CONST.SERVICE_INPUT_TYPE.DATE,
                        placeHolder: {
                            EN: 'Select DOB',
                            AR: 'SELECT DOB'
                        },
                        displayName: {
                            EN: '',
                            AR: ''
                        },
                        required: true,
                        validateAs: CONST.SERVICE_VALIDATE_TYPE.NONE
                    },
                    {
                        order: 0,
                        name: 'avatar',
                        inputType: CONST.SERVICE_INPUT_TYPE.FILE,
                        placeHolder: {
                            EN: '',
                            AR: ''
                        },
                        displayName: {
                            EN: 'Select profile',
                            AR: 'AR Select profile'
                        },
                        required: false,
                        validateAs: CONST.SERVICE_VALIDATE_TYPE.NONE
                    }
                ]
            },
            {
                number: 4,
                inputItems: [
                    {
                        order: 0,
                        name: 'tableContent',
                        inputType: CONST.SERVICE_INPUT_TYPE.TABLE,
                        additional: {sectorField: 'position'},
                        dataSource: [
                            {value: 'id', AR: 'al Reference #', EN: 'Reference #'},
                            {value: 'first', AR: 'al First Name', EN: 'FirstName'},
                            {value: 'last', AR: 'al Last Name', EN: 'Last Name'},
                            {value: 'position', AR: 'al Job Position', EN: 'Job Position'}
                        ],
                        placeHolder: {
                            EN: '',
                            AR: ''
                        },
                        displayName: {
                            EN: 'Some Table',
                            AR: 'AR Some Table'
                        },
                        required: false,
                        validateAs: CONST.SERVICE_VALIDATE_TYPE.NONE
                    }
                ]
            }
        ]
    }

};