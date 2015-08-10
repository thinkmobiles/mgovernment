'use strict';

module.exports = {

    WHOIS_URL: 'whois.aeda.net.ae',
    WHOIS_CHECK_URL: 'whois-check.aeda.net.ae',
    WHOIS_PORT: 43,

    MOBILE_SEARCH_URL: 'https://ta-uat.tra.gov.ae:65004/tasserver/v1/imei?method=search',

    CRM_USER: 'TRA\crm.acc',
    CRM_PASS: 'TRA_#admin',
    CRM_URL: 'http://do-crm15/TRA/main.aspx',
    EMAIL_COMPLAINSMSSPAM: 'complainsmsspam@ukr.net' // password: complainsmsspam
    //CRM inner IP: 192.168.91.232
    //DB inner IP: 192.168.90.50

    CRM_ORGANIZATION_UNIQUE_NAME: 'TRA',
    CRM_DISCOVERY_SERVICE: 'http://do-crm15/XRMServices/2011/Discovery.svc',                //SOAP
    CRM_ORGANIZATION_SERVICE: 'http://do-crm15/XRMServices/2011/Organization.svc',          //SOAP
    CRM_ORGANIZATION_DATA_SERVICE: 'http://do-crm15/XRMServices/2011/OrganizationData.svc'  //OData REST
};