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

    EMAIL_COMPLAINSMSSPAM: 'smsspam@ukr.net',// password: smsspam
    EMAIL_COMPLAIN_SERVICE_PROVIDER: 'complainserviceprovider@rambler.ru',// password: complainserviceprovider

    EMAIL_COMPLAIN_FROM: 'testTRA@testTRA.ae',

    EMAIL_HELP_SALIM: 'helpsalim@ukr.net'// password: helpsalim

};