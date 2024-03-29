
module.exports = {

    START_SCREEN_LAYOUT: {
        layoutName: 'startScreenLayout',
        layoutType: 'login',
        layoutId: 'startScreenLayoutl11122',
        '_id':'5590e91132fd46600722f6f3',

        screenOptions:{
            headerType:'header',
            title: 'Please input authorization info',
            backgorundImg:'uri:/img/background.jpg',
            backgorundColor:'white',
            footterBarType:'3button'
        },

        items: [
            {
                order: 112,
                name: '',
                itemType: 'label',
                dataSource: 'Login',
                id:'@loginLable',
                action: {}
            },

            {
                order: 113,
                name: '',
                itemType: 'textInput',
                dataSource: 'username@exemple.com',
                id: '@loginInput',
                action: {
                    onChange: 'checkLogin()'
                }
            },
            {
                order: 114,
                name: '',
                itemType: 'label',
                dataSource: 'Pass',
                id:'@passLable',
                action: {}
            },
            {
                order: 115,
                name: '',
                itemType: 'textInput',
                dataSource: '*********',
                id:'@passInput',
                action: {
                    onChange: 'checkPass()'
                }

            },
            {
                order: 116,
                name: 'button',
                itemType: 'button',
                dataSource: 'Login',
                id:'loginButton',
                action: {
                    onClick: {
                        method: 'POST',
                        uri: '/user/signIn',
                        options: {
                            logon: '@loginInput',
                            pass: '@passInput'
                        }
                    }
                }
            }
        ]},

    START_SCREEN_LAYOUT_ITEM_FOR_UPDATE: {
        layoutName: 'startScreenLayout',
        layoutId: 'startScreenLayoutl11122',
        '_id':'5590e91132fd46600722f6f3',

        items: [
            {
                order: 114,
                name: 'Password updated',
                itemType: 'label updated',
                dataSource: 'Password updated',
                id:'@passLable',
                action: {}
            }
        ]},

    START_SCREEN_LAYOUT_ITEM_FOR_POST: {
        layoutName: 'startScreenLayout',
        layoutId: 'startScreenLayoutl11122',
        '_id':'5590e91132fd46600722f6f3',

        items: [
            {
                order: 117,
                name: 'Password POSTED',
                itemType: 'label POSTED',
                dataSource: 'Password POSTED',
                id:'@passLable POSTED',
                action: {}
            }
        ]},

    SERVICES_LIST_SCREEN_LAYOUT_BEFORE_UPDATING: {
        layoutName: 'ServicesListScreeLayout',
        layoutType: 'servicesList',
        layoutId: 'servicesListLayout222222',
        '_id':'5590e91132fd46600722f6f5',

        screenOptions: {
            headerType: 'bad',
            title: 'bad LIST OF SERVICES',
            backgorundImg: ' bad uri:/img/backgroundServices.jpg',
            backgorundColor: 'bad blue',
            footterBarType: 'bad 4button'
        }
    },

    SERVICES_LIST_SCREEN_LAYOUT_FOR_UPDATING: {
        layoutName: 'ServicesListScreeLayout',
        layoutType: 'servicesList',
        layoutId: 'servicesListLayout222222',
        '_id':'5590e91132fd46600722f6f5',

        screenOptions:{
            headerType:'header',
            title: 'LIST OF SERVICES',
            backgorundImg:'uri:/img/backgroundServices.jpg',
            backgorundColor:'blue',
            footterBarType:'4button'
        },

        items: [
            {
                order: 221,
                name: '',
                itemType: 'label',
                dataSource: 'Service1',
                id:'@Service1Lable',
                action: {}
            },

            {
                order: 222,
                name: 'button',
                itemType: 'button',
                dataSource: 'Open Service1',
                id: '@openService1',
                action: {
                    onClick: {
                        method: 'POST',
                        uri: '/services1/open',
                        options: {
                            //logon: '@loginInput',
                            //pass: '@passInput'
                        }
                    }
                }
            },
            {
                order: 223,
                name: 'button',
                itemType: 'button',
                dataSource: 'Change Settings',
                id:'@changeService1',
                action: {
                    onClick: {
                        method: 'POST',
                        uri: '/services1/change',
                        options: {
                            //logon: '@loginInput',
                            //pass: '@passInput'
                        }
                    }
                }
            }
        ]}
};