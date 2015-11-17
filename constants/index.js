module.exports = {

    USER_TYPE: {
        ADMIN: 'admin',
        CLIENT: 'client',
        COMPANY: 'company',
        GOVERNMENT: 'government',
        GUEST: 'guest'
    },

    DEVICE_TYPE: {
        IOS: 'ios',
        ANDROID: 'android'
    },

    MODELS: {
        ATTACHMENT: 'Attachment',
        SERVICES_ICON: 'ServicesIcon',
        USER: 'User',
        PROFILE: 'Profile',
        LAYOUT: 'Layout',
        SESSION: 'Session',
        ADMIN_HISTORY: 'AdminHistoryLog',
        USER_HISTORY: 'UserHistoryLog',
        SERVICE: 'Service',
        IMAGE: 'Image',
        FEEDBACK: 'Feedback',
        INNOVATION: 'Innovation',
        EMAIL_REPORT: 'emailReport',
        ANNOUNCEMENT: 'Announcement'
    },

    ACTION: {
        CREATE: 'Create',
        UPDATE: 'Update',
        GET: 'Get',
        POST: 'Post',
        FIND: 'Find',
        READ: 'Read',
        DELETE: 'Delete'
    },

    SERVICE_PROVIDERS: {
        DEFAULT_REST: 'DefaultRest',
        TRA_TAS: 'TraTasTda',
        TEST_TRA_SOCKET: 'TestTraSocket'
    },

    SERVICE_METHOD: {
        GET: 'GET',
        POST: 'POST'
    },

    SERVICE_PARAMS: {
        BODY: 'body',
        QUERY: 'query',
        REST_QUERY: 'restQuery'
    },

    SERVICE_INPUT_TYPE: {
        STRING: 'string',
        TEXT: 'text',
        BOOLEAN: 'boolean',
        FILE: 'file',
        DATE: 'date',
        PICKER: 'picker',
        TABLE: 'table'
    },

    SERVICE_VALIDATE_TYPE: {
        NONE: 'none',
        STRING: 'string',
        NUMBER: 'number',
        URL: 'url',
        EMAIL: 'email'
    },

    ALPHABETICAL_FOR_TOKEN: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890',

    APPLICATION_KEY_FOR_TOKEN: 'testAppKey'
};