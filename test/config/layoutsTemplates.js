
module.exports = {

    START_SCREEN_LAYOUT: {
        layoutName: 'startScreeLayout',
        layoutType: 'login',
        id: 'startScreeLayoutl11122',

        screenOptions:{
            headerType:'header',
            title: 'Please input authorization info',
            backgorundImg:'uri:\img\background.jpg',
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
                id: 'loginInput',
                action: {
                    onChange: 'checkLogin()'
                }
            },
            {
                order: 114,
                name: '',
                itemType: 'textInput',
                dataSource: '*********',
                id:'passInput',
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

        ],
        lastChange: {type: Date, default: Date.now}
    }


};