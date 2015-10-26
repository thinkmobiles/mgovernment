'use strict';

module.exports = {

    WHOIS_URL: '79.98.120.25', //'whois.aeda.net.ae',
    WHOIS_CHECK_URL: '79.98.120.29', //'whois-check.aeda.net.ae',
    WHOIS_PORT: 43,

    MOBILE_SEARCH_URL: 'https://192.168.91.98:65104/tasserver/v1/imei?method=search',
    /*Hostname: ta-uat
      DNS name: ta-uat.tra.gov.ae
      IP address: 192.168.91.98
      https://ta-uat.tra.gov.ae:65004/tasserver/v1/imei?method=search
    */

    CRM_CONNECTION: 'Url=http://192.168.91.232/TRA; Domain=TRA; Username=crm.acc; Password=TRA_#admin;',

    CRM_USER: 'TRA\crm.acc',
    CRM_PASS: 'TRA_#admin',
    CRM_URL: 'do-crm15',
    //CRM inner IP: 192.168.91.232
    //DB inner IP: 192.168.90.50

    CRM_ORGANIZATION_UNIQUE_NAME: 'TRA',
    CRM_DISCOVERY_SERVICE: 'http://do-crm15/XRMServices/2011/Discovery.svc',                //SOAP
    CRM_ORGANIZATION_SERVICE: 'http://do-crm15/XRMServices/2011/Organization.svc',          //SOAP
    CRM_ORGANIZATION_DATA_SERVICE: 'http://do-crm15/XRMServices/2011/OrganizationData.svc', //OData REST


    //EMAIL_COMPLAIN_SERVICE_PROVIDER: 'complainserviceprovider@rambler.ru',// password: complainserviceprovider
    //EMAIL_COMPLAIN_TRA_SERVICE: 'complaintraservice@rambler.ru',// password: complaintraservice

    EMAIL_COMPLAIN_SERVICE_PROVIDER: 'allcomplaintra@mail.com',// password: allotheremails
    EMAIL_COMPLAIN_TRA_SERVICE: 'allcomplaintra@mail.com',//

    EMAIL_COMPLAIN_ENQUIRIES: 'allcomplaintra@mail.com',
    EMAIL_COMPLAIN_SUGGESTION: 'allcomplaintra@mail.com',
    EMAIL_COMPLAIN_POOR_COVERAGE: 'allcomplaintra@mail.com',

    EMAIL_COMPLAIN_FROM: 'testTRA@testTRA.ae',

    EMAIL_FORGOT_FROM: 'testTRA@testTRA.ae',

    EMAIL_COMPLAINSMSSPAM: 'allcomplaintra@mail.com',// password: smsspam
    EMAIL_HELP_SALIM: 'allcomplaintra@mail.com',// password: helpsalim

    //TODO use for test server
    //'allcomplaintra@mail.com',// pass:allcomplaintra1q

    CRM_ENUM: {
        STATE: {
            'Abu Dhabi': 1,
            'Ajman': 2,
            'Dubai': 3,
            'Fujairah': 4,
            'Ras al-Khaiman': 5,
            'Sharjah': 6,
            'Umm al-Quwain': 7
        },
        COUNTRY: {
            UAE: 1
        },
        CASE_TYPE: {
            SMS_SPAM: 5,
            SUGGESTION: 1,
            INQUIRY: 2,
            COMPLAINT_TRA: 3,
            COMPLAINT_SERVICE_PROVIDER: 4
        },
        SERVICE_PROVIDER: {
            DU: 'du',
            ETISALAT: 'Etisalat',
            YAHSAT: 'Yahsat'
        }
    },

    INNOVATION_TYPE: {
        CustomerHappiness: 1,
        EmployeeSatisfaction: 2,
        TRAServiceImprovement: 3,
        ReducingCostIncreasingRevenue: 4,
        RaisingTRAInstitutionalReputation: 5,
        FuturologyStudies: 6
    },

    NO_CRM_ENUM:{
        REGISTER: 'register',
        UPDATE_PROFILE: 'updateProfile',
        CASE_TYPE: {
            SMS_BLOCK: 11,
            POOR_COVERAGE: 12,
            HELP_SALIM: 13
        }

    }
    /*
     1 - Customer Happiness
     2 - Employee Satisfaction
     3 - TRA Service Improvement
     4 � Reducing cost & increasing Revenue
     5 - Raising TRA Institutional Reputation
     6 � Futurology Studies
     */
};