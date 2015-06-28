
module.exports = {

    START_SCREEN_LAYOUT: {
        layoutName: 'startScreeLayout',
        layoutType: 'login',
        layoutId: 'startScreeLayoutl11122',

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
                order: 115,
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
        layoutId: 'startScreeLayoutl11122',

        items: [
            {
                order: 114,
                name: 'Password updated',
                itemType: 'label',
                dataSource: 'Password',
                id:'@passLable',
                action: {}
            }
        ]},

    SERVICES_LIST_SCREEN_LAYOUT: {
        layoutName: 'ServicesListScreeLayout',
        layoutType: 'servicesList',
        layoutId: 'servicesListLayout222222',

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