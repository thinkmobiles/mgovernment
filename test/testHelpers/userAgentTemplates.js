var APP_KEY = require('../../constants/index');

module.exports = {

    IPAD_DEVICE: {
        'appkey': APP_KEY.APPLICATION_KEY_FOR_TOKEN,
        'user-agent': 'Mozilla/5.0 (iPad; CPU OS 5_1_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/9B206'
    },

    IPHONE_DEVICE: {
        'appkey': APP_KEY.APPLICATION_KEY_FOR_TOKEN,
        'user-agent': 'Opera/9.80 (J2ME/MIDP; Opera Mini/5.0 (iPhone; U; xxxx like Mac OS X; en) AppleWebKit/24.838; U; en) Presto/2.5.25 Version/10.54'
    },

    ANDROID_DEVICE: {
        'appkey': APP_KEY.APPLICATION_KEY_FOR_TOKEN,
        'user-agent': 'Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K) AppleWebkit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'
    }
};
