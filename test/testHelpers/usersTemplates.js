
module.exports = {

    CLIENT: {
        login: 'client777',
        pass: 'pass1234',
        userType: 'client',
        accounts:[{
            serviceProvider: 'CAPALABA',
            serviceId: '559ccf6abb74dd001f2d0c75',
            login: 'admin',
            pass: '1q2w3e4r',
            lastSignInAt:'',
            userCookie: '',
            cookieUpdatedAt: '',
            accountUpdatedAt: ''
        }]
    },

    COMPANY: {
        login: 'company777',
        pass: 'pass1234',
        userType: 'company'
    },

    GOVERNMENT: {
        login: 'government777',
        pass: 'pass1234',
        userType: 'government'
    },

    CLIENT_GOOD_USER_TYPE: {
        login: 'client123',
        pass: 'pass1234',
        userType: 'client'
    },

    CLIENT_GOOD_USER_TYPE_FOR_DELETING: {
        login: 'clientForDeleting',
        pass: 'clientForDeleting',
        userType: 'client'
    },

    CLIENT_BAD_USER_TYPE: {
        login: 'client123',
        pass: 'pass1234',
        userType: 'client bad userType'
    },

    CLIENT_BAD_PASSWORD: {
        login: 'client123',
        pass: 'pass1234 bad password',
        userType: 'client bad userType'
    },

    CLIENT_GOOD_DEVICE_OS: {
        login: 'client123',
        pass: 'pass1234',
        userType: 'client',
        deviceOs: "android",
        deviceToken: "Pilesos Token12343"
    },

    CLIENT_GOOD_DEVICE_OS_DIFFERENT_DEVICE_TOKEN: {
        login: 'client123',
        pass: 'pass1234',
        userType: 'client',
        deviceOs: "android",
        deviceToken: "Skovoroda Token Skovoroda  "
    },

    CLIENT_BAD_DEVICE_OS: {
        login: 'client123',
        pass: 'pass1234',
        userType: 'client',
        deviceOs: "ios bad os",
        deviceToken: " Skovorodka Token12343"
    },

    CLIENT_GOOD_DIFFERENT_DEVICE_OS: {
        login: 'client123',
        pass: 'pass1234',
        deviceOs: "windows",
        deviceToken: "Nokia  Token----"
    },

    ADMIN: {
        login: 'admin123',
        pass: 'pass1234',
        userType: 'admin'
    },

    ADMIN_DEFAULT: {
        login: 'defaultAdmin',
        pass: 'defaultAdmin'
          },

    CLIENT_PLUS_ACCOUNT: {
        login: 'client123',
        pass: 'pass1234',
        userType: 'client',
        "seviceName": "love.mail.ru",
        "seviceOptions": "love, meet, chat",
        "serviceLogin": "HotKroshka",
        "servicePass": "gtgtgtgt"
    },

    CLIENT_CHANGE_ACCOUNT: {
        login: 'client123',
        pass: 'pass1234',
        userType: 'client',
        "seviceName": "love.mail.ru",
        "seviceOptions": "Game ---is changing",
        "serviceLogin": "HotKroshka",
        "servicePass": "gtgtgtgt"
    }
};