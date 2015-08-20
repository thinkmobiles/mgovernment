'use strict';

module.exports = {

    WHOIS_URL: 'whois.aeda.net.ae',
    WHOIS_CHECK_URL: 'whois-check.aeda.net.ae',
    WHOIS_PORT: 43,

    MOBILE_SEARCH_URL: 'https://ta-uat.tra.gov.ae:65004/tasserver/v1/imei?method=search',

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

    EMAIL_COMPLAINSMSSPAM: 'allcomplaintra@mail.com',// password: smsspam
    EMAIL_HELP_SALIM: 'allcomplaintra@mail.com'// password: helpsalim

    //TODO use for test server
    //'allcomplaintra@mail.com',// pass:allcomplaintra1q

};