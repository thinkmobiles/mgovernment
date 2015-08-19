var CONST = require('../../constants/index');

module.exports = {

    SERVICE_CAPALABA_RITEILS: {
        serviceProvider: 'Capalaba',
        serviceName: 'Riteils',
        serviceType: 'XZ WTF ?',
        baseUrl: 'http://134.249.164.53:7788/',
        profile: {
            description : 'bla bla bla'},

        forUserType: [CONST.USER_TYPE.GUEST, CONST.USER_TYPE.CLIENT, CONST.USER_TYPE.ADMIN, CONST.USER_TYPE.COMPANY, CONST.USER_TYPE.GOVERNMENT],
        inputItems: [{
            order: 11,
            name: 'eeee',
            inputType: 'IMG',
            placeHolder: 'base64 sdasd sfdsd fkjjbkzbhkzashe2kj421u34hejrb lkj32  ',
            options: []
        }
        ],
        method: 'GET',
        url: 'retailer?count=10&page=1&orderBy=name&order=ASC',
        params: {
            needUserAuth: true,
            onClick: '/sdadsadsa sadasdas'
        }
    },

    SERVICE_RATING_TMA_TRA_SERVICES: {
        serviceProvider: 'TmaTraServices',
        serviceName: 'Rating service',
        serviceType: 'feedback',
        baseUrl: 'http://134.249.164.53:7791/',
        profile: {
            description : 'Feedback about Servcie'},

        forUserType: [CONST.USER_TYPE.GUEST, CONST.USER_TYPE.CLIENT, CONST.USER_TYPE.ADMIN, CONST.USER_TYPE.COMPANY, CONST.USER_TYPE.GOVERNMENT],
        inputItems: [
            {
                order: 1,
                name: 'serviceName',
                inputType: 'string'
            },
            {
                order: 2,
                name: 'rate',
                inputType: 'string'
            },
            {
                order: 3,
                name: 'feedback',
                inputType: 'string'
            }
        ],
        method: 'POST',
        url: '/feedback',
        params: {
            needUserAuth: false,
            body: ['serviceName','rate', 'feedback']
        }
    },

    SERVICE_SMS_SPAM_TMA_TRA_SERVICES: {
        serviceProvider: 'TmaTraServices',
        serviceName: 'SMS Spam Report',
        serviceType: 'complain',
        baseUrl: 'http://134.249.164.53:7791/',
        profile: {
            description : 'Feedback about Servcie'},

        forUserType: [CONST.USER_TYPE.GUEST, CONST.USER_TYPE.CLIENT, CONST.USER_TYPE.ADMIN, CONST.USER_TYPE.COMPANY, CONST.USER_TYPE.GOVERNMENT],
        inputItems: [
            {
                order: 1,
                name: 'phone',
                inputType: 'string'
            },
            {
                order: 2,
                name: 'description',
                inputType: 'string'
            }
        ],
        method: 'POST',
        url: 'complainSmsSpam',
        params: {
            needUserAuth: false,
            body: ['phone','description']
        }
    },

    SERVICE_SMS_BLOCK_TMA_TRA_SERVICES: {
        serviceProvider: 'TmaTraServices',
        serviceName: 'SMS Spam Block',
        serviceType: 'complain',
        baseUrl: 'http://134.249.164.53:7791/',
        profile: {
            description : 'Feedback about Servcie'},

        forUserType: [CONST.USER_TYPE.GUEST, CONST.USER_TYPE.CLIENT, CONST.USER_TYPE.ADMIN, CONST.USER_TYPE.COMPANY, CONST.USER_TYPE.GOVERNMENT],
        inputItems: [
            {
                order: 1,
                name: 'phone',
                inputType: 'string'
            },
            {
                order: 2,
                name: 'phoneProvider',
                inputType: 'string'
            },
            {
                order: 3,
                name: 'providerType',
                inputType: 'string'
            },
            {
                order: 4,
                name: 'description',
                inputType: 'string'
            }
        ],
        method: 'POST',
        url: 'complainSmsBlock',
        params: {
            needUserAuth: false,
            body: ['phone', 'phoneProvider', 'providerType', 'description']
        }
    },

    SERVICE_TMA_TRA_CHECK_MOBILE_VERIFICATION: {
        serviceProvider: 'TmaTraServices',
        serviceName: 'Check Mobile Verification',
        serviceType: 'Mobile',
        baseUrl: 'http://tma.tra.gov.ae/',
        profile: {
            description : 'bla bla bla'},

        forUserType: [CONST.USER_TYPE.GUEST, CONST.USER_TYPE.CLIENT, CONST.USER_TYPE.ADMIN, CONST.USER_TYPE.COMPANY, CONST.USER_TYPE.GOVERNMENT],
        inputItems: [{
            order: 11,
            name: 'eeee',
            inputType: 'IMG',
            placeHolder: 'base64 sdasd sfdsd fkjjbkzbhkzashe2kj421u34hejrb lkj32  ',
            options: []
        }
        ],
        method: 'POST',
        url: 'tra_api/service/isfakedevice',
        params: {
            needUserAuth: false
        }
    },

    SERVICE_CAPALABA_COMMUNICATIONS_GET: {
        serviceProvider: 'Capalaba',
        serviceName: 'communications',
        serviceType: 'XZ WTF ?',
        baseUrl: 'http://134.249.164.53:7788/',
        profile: {
            description : 'bla bla bla'},

        forUserType: [CONST.USER_TYPE.GUEST, CONST.USER_TYPE.CLIENT, CONST.USER_TYPE.ADMIN, CONST.USER_TYPE.COMPANY, CONST.USER_TYPE.GOVERNMENT],
        inputItems: [{
            order: 11,
            name: 'eeee',
            inputType: 'IMG',
            placeHolder: 'base64 sdasd sfdsd fkjjbkzbhkzashe2kj421u34hejrb lkj32  ',
            options: []
        }
        ],
        method: 'GET',
        url: 'pushMessage?count=10&page=1&orderBy=end_datetime&order=DESC',
        params: {
            needUserAuth: true,
            onClick: '/sdadsadsa sadasdas'
        }
    },
    SERVICE_CAPALABA_COMMUNICATIONS_POST: {
        serviceProvider: 'Capalaba',
        serviceName: 'communications',
        serviceType: 'XZ WTF ?',
        baseUrl: 'http://134.249.164.53:7788/',
        profile: {
            description : 'bla bla bla'},

        forUserType: [CONST.USER_TYPE.GUEST, CONST.USER_TYPE.CLIENT, CONST.USER_TYPE.ADMIN, CONST.USER_TYPE.COMPANY, CONST.USER_TYPE.GOVERNMENT],
        inputItems: [{
            order: 11,
            name: 'eeee',
            inputType: 'IMG',
            placeHolder: 'base64 sdasd sfdsd fkjjbkzbhkzashe2kj421u34hejrb lkj32  ',
            options: []
        }
        ],
        method: 'POST',
        url: 'pushMessage/',
        params:{
            needUserAuth: true,
            onClick: '/sdadsadsa sadasdas'
        }
    },

    SERVICE_SPEDTEST_INET: {
        serviceProvider: 'Ookla',
        serviceName: 'SpeedTest',
        serviceType: 'Internet',
        baseUrl: 'http://www.speedtest.net/',
        profile: {
            description : 'The Definitive Source for Global Internet Metrics'},

        forUserType: [CONST.USER_TYPE.GUEST, CONST.USER_TYPE.CLIENT, CONST.USER_TYPE.ADMIN, CONST.USER_TYPE.COMPANY, CONST.USER_TYPE.GOVERNMENT],
        inputItems: [{
            order: 11,
            name: 'eeee',
            inputType: 'IMG',
            placeHolder: 'base64 sdasd sfdsd fkjjbkzbhkzashe2kj421u34hejrb lkj32  ',
            options: []
        },
            {
                order: 12,
                name: 'Start Test',
                type: 'Button',
                placeHolder: '',
                options: [{onClick: '/sdadsadsa sadasdas'}]
            }
        ],
        method: 'POST',
        url: '/speedtest/',
        params: {
            needUserAuth: true,
            onClick: '/sdadsadsa sadasdas'
        }
    },

    SERVICE_SPEDTEST_INET_FOR_UPDATING: {
        serviceProvider: 'Ookla',
        serviceName: 'SpeedTest',
        serviceType: 'Internet',
        baseUrl: 'http://www.speedtest.net/',
        profile: {
            description : 'The Definitive Source for Global Internet Metrics'},

        forUserType: [CONST.USER_TYPE.GUEST, CONST.USER_TYPE.CLIENT, CONST.USER_TYPE.ADMIN, CONST.USER_TYPE.COMPANY, CONST.USER_TYPE.GOVERNMENT],
        inputItems: [{
            order: 11,
            name: 'eeee',
            inputType: 'IMG',
            placeHolder: 'base64 sdasd sfdsd fkjjbkzbhkzashe2kj421u34hejrb lkj32  ',
            options: []
        },
            {
                order: 12,
                name: 'Input you Name updated',
                type: 'text',
                placeHolder: 'Input you Name  updated',
                options: ['updated']
            },
            {
                order: 13,
                name: 'Start Test',
                type: 'Button',
                placeHolder: '',
                options: [{onClick: '/sdadsadsa sadasdas'}]
            }

        ],
        method: 'POST',
        url: '/speedtest/',
        params: {
            needUserAuth: true,
            onClick: '/sdadsadsa sadasdas'
        }
    },

    SERVICE_GOLD_BANCOMAT: {
        serviceProvider: 'HoldGold',
        serviceName: 'GOLD SELL',
        serviceType: 'Payment',
        baseUrl: 'http://www.holdgold.net/',
        profile: {
            description : ' '},

        forUserType: [ CONST.USER_TYPE.CLIENT, CONST.USER_TYPE.COMPANY, CONST.USER_TYPE.GOVERNMENT],
        inputItems: [{
            order: 22,
            name: 'eeee',
            inputType: 'IMG',
            placeHolder: '  ',
            options: []
        },
            {
                order: 23,
                name: 'Buy 1 Kg ',
                type: 'Button',
                placeHolder: '',
                options: [{onClick: '/buy'}]
            }
        ],
        method: 'POST',
        url: '/gold/',
        params: {
            needUserAuth: true,
            onClick: ''
        }
    },

    SERVICE_GOLD_BANCOMAT_FOR_UPDATE: {
        serviceProvider: 'HoldGold',
        serviceName: 'GOLD SELL',
        serviceType: 'Payment',
        baseUrl: 'http://www.holdgold.net/',
        profile: {
            description : 'Gold 0.1-1 Kg, in Bankomat or by delivery by courier '},

        forUserType: [CONST.USER_TYPE.GUEST, CONST.USER_TYPE.CLIENT, CONST.USER_TYPE.ADMIN, CONST.USER_TYPE.COMPANY, CONST.USER_TYPE.GOVERNMENT],
        inputItems: [{
            order: 11,
            name: 'eeee',
            inputType: 'IMG',
            placeHolder: 'base64 sdasd sfdsd fkjjbkzbhkzashe2kj421u34hejrb lkj32  ',
            options: []
        },
            {
                order: 12,
                name: 'Buy 1 Kg ',
                type: 'Button',
                placeHolder: '',
                options: [{onClick: '/buy'}]
            }
        ],
        method: 'POST',
        url: '/gold/',
        params: {
            needUserAuth: true,
            onClick: '/sdadsadsa sadasdas'
        }
    },

    SERVICE_OIL: {
        serviceProvider: 'Oil retail',
        serviceName: 'OIL INVESTMENT',
        serviceType: 'Payment',
        baseUrl: 'http://www.oil.net/',
        profile: {
            description: 'Oil wells wholesale and retail'},

        forUserType: [CONST.USER_TYPE.CLIENT, CONST.USER_TYPE.COMPANY, CONST.USER_TYPE.GOVERNMENT],
        inputItems: [{
            order: 22,
            name: 'eeee',
            inputType: 'IMG',
            placeHolder: '  base 64 sfldsfjf .;ldjf ;lj dsfg-0fd9h-0df9 -0df9g-d',
            options: []
        },
            {
                order: 23,
                name: 'Buy 1 well ',
                type: 'Button',
                placeHolder: '',
                options: [{onClick: '/buy'}]
            }
        ],
        method: 'POST',
        url: '/oil',
        params: {
            needUserAuth: true,
            onClick: ''
        }
    }
};



//    START_SCREEN_LAYOUT_ITEM_FOR_UPDATE: {
//        layoutName: 'startScreenLayout',
//        layoutId: 'startScreenLayoutl11122',
//        '_id':'5590e91132fd46600722f6f3',
//
//        items: [
//            {
//                order: 114,
//                name: 'Password updated',
//                itemType: 'label updated',
//                dataSource: 'Password updated',
//                id:'@passLable',
//                action: {}
//            }
//        ]},
//
//    START_SCREEN_LAYOUT_ITEM_FOR_POST: {
//        layoutName: 'startScreenLayout',
//        layoutId: 'startScreenLayoutl11122',
//        '_id':'5590e91132fd46600722f6f3',
//
//        items: [
//            {
//                order: 117,
//                name: 'Password POSTED',
//                itemType: 'label POSTED',
//                dataSource: 'Password POSTED',
//                id:'@passLable POSTED',
//                action: {}
//            }
//        ]},
//
//    SERVICES_LIST_SCREEN_LAYOUT_BEFORE_UPDATING: {
//        layoutName: 'ServicesListScreeLayout',
//        layoutType: 'servicesList',
//        layoutId: 'servicesListLayout222222',
//        '_id':'5590e91132fd46600722f6f5',
//
//        screenOptions: {
//            headerType: 'bad',
//            title: 'bad LIST OF SERVICES',
//            backgorundImg: ' bad uri:/img/backgroundServices.jpg',
//            backgorundColor: 'bad blue',
//            footterBarType: 'bad 4button'
//        }
//    },
//
//    SERVICES_LIST_SCREEN_LAYOUT_FOR_UPDATING: {
//        layoutName: 'ServicesListScreeLayout',
//        layoutType: 'servicesList',
//        layoutId: 'servicesListLayout222222',
//        '_id':'5590e91132fd46600722f6f5',
//
//        screenOptions:{
//            headerType:'header',
//            title: 'LIST OF SERVICES',
//            backgorundImg:'uri:/img/backgroundServices.jpg',
//            backgorundColor:'blue',
//            footterBarType:'4button'
//        },
//
//        items: [
//            {
//                order: 221,
//                name: '',
//                itemType: 'label',
//                dataSource: 'Service1',
//                id:'@Service1Lable',
//                action: {}
//            },
//
//            {
//                order: 222,
//                name: 'button',
//                itemType: 'button',
//                dataSource: 'Open Service1',
//                id: '@openService1',
//                action: {
//                    onClick: {
//                        method: 'POST',
//                        uri: '/services1/open',
//                        options: {
//                            //logon: '@loginInput',
//                            //pass: '@passInput'
//                        }
//                    }
//                }
//            },
//            {
//                order: 223,
//                name: 'button',
//                itemType: 'button',
//                dataSource: 'Change Settings',
//                id:'@changeService1',
//                action: {
//                    onClick: {
//                        method: 'POST',
//                        uri: '/services1/change',
//                        options: {
//                            //logon: '@loginInput',
//                            //pass: '@passInput'
//                        }
//                    }
//                }
//            }
//        ]}
//};
