/**
 * Provides the services to get information by imei(tac), brand name, domain name
 * @class whoIsAndMobile
 *
 */

var express = require( 'express' );
var router = express.Router();

var WhoIsAndMobileHandler = require('../handlers/whoIsAndMobileHandler');

module.exports = function(db) {
    'use strict';

    var whoIsAndMobileHandler = new WhoIsAndMobileHandler(db);

    /**
     * This __method__ get information about domain name
     *
     * __URI:__ ___`/checkWhois`___
     *
     *  ## METHOD:
     * __GET__
     *
     *  ## Request:
     *     Query: checkUrl
     *     Exemple: /checkWhois?checkUrl=tra.gov.ae
     *
     *  ## Responses:
     *      status (200) JSON object: {object}
     *      status (400, 403, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     *
     * @example
     *     {
     *      Domain Name: 'tra.gov.ae',
     *      Registrar ID: 'Etisalat',
     *      Registrar Name:  'Etisalat',
     *      Status: 'ok'....
     *      ................
     *      }
     *
     * @method testWhois
     * @for whoIsAndMobile
     * @memberOf whoIsAndMobile
     */
    router.get('/checkWhois', whoIsAndMobileHandler.testWhois);

    /**
     * This __method__ get information if the domain is available
     *
     * __URI:__ ___`/checkWhoisAvailable`___
     *
     *  ## METHOD:
     * __GET__
     *
     *  ## Request:
     *     Query: checkUrl
     *     Exemple: /checkWhoisAvailable?checkUrl=tra.gov.ae
     *
     *  ## Responses:
     *      status (200) JSON object: {object}
     *      status (400, 403, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     *
     * @example
     *     {
     *      Not Available
     *      }
     *
     * @method checkWhoisAvailable
     * @for whoIsAndMobile
     * @memberOf whoIsAndMobile
     */
    router.get('/checkWhoisAvailable', whoIsAndMobileHandler.testWhoisCheck);

    /**
     * This __method__ search devices by imei (tac code)
     *
     * __URI:__ ___`/searchMobile`___
     *
     *  ## METHOD:
     * __GET__
     *
     *  ## Request:
     *      Query:
     *      imei
     *      start //not require
     *      end //not require
     *
     *     Exemple: /searchMobile?imei=01385100
     *
     *  ## Responses:
     *      status (200) JSON object: {object}
     *      status (400, 403, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     *
     * @example
     *      [{
     *      "tac": "01355500",
     *      "marketingName": "Apple iPhone 5 A1429",
     *      "designationType": "A1429",
     *      "manufacturer": "Apple Inc",
     *      "bands": "GSM 1800, GSM 1900, GSM 900, GSM850 (GSM800), HSDPA, HSUPA, LTE FDD BAND 1, LTE FDD BAND 13, LTE FDD BAND 15, LTE FDD BAND 3, LTE FDD BAND 5, WCDMA FDD Band I, WCDMA FDD Band II, WCDMA FDD Band V, WCDMA FDD Band VIII, WiFi.",
     *      "allocationDate": "2012-12-05",
     *      "countryCode": "310",
     *      "fixedCode": "MAN",
     *      "radioInterface": "EDGE, GPRS",
     *      "manufacturerCode": "205157",
     *      "startIndex": 0,
     *      "endIndex": 1000,
     *      "count": 1,
     *      "totalNumberofRecords": 1
     *      }]
     *
     *
     * @method searchMobile
     * @for whoIsAndMobile
     * @memberOf whoIsAndMobile
     */
    router.get('/searchMobile', whoIsAndMobileHandler.searchMobileImei);

    /**
     * This __method__ search device by brand name
     *
     * __URI:__ ___`/searchMobileBrand`___
     *
     *  ## METHOD:
     * __GET__
     *
     *  ## Request:
     *      Query:
     *      imei
     *      start //not require
     *      end //not require
     *
     *     Exemple: /searchMobileBrand?brand=Appl%&start=2&end=5
     *
     *  ## Responses:
     *      status (200) JSON object: {object}
     *      status (400, 403, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     *
     * @example
     *      [{
     *      "tac": "01275800",
     *      "marketingName": "iPhone 4 (A1332)",
     *      "designationType": "iPhone 4 (A1332)",
     *      "manufacturer": "Apple Inc",
     *      "bands": "GSM 1800, GSM 1900, GSM 900, GSM850 (GSM800), WCDMA FDD Band I, WCDMA FDD Band II, WCDMA FDD Band V, WCDMA FDD Band VIII",
     *      "allocationDate": "2011-03-24",
     *      "countryCode": "310",
     *      "fixedCode": "MAN",
     *      "radioInterface": "NONE",
     *      "manufacturerCode": "205157",
     *      "startIndex": 2,
     *      "endIndex": 5,
     *      "count": 3,
     *      "totalNumberofRecords": 1247
     *      },*  ....
     *      ]
     *
     * @method searchMobileBrand
     * @for whoIsAndMobile
     * @memberOf whoIsAndMobile
     */
    router.get('/searchMobileBrand', whoIsAndMobileHandler.searchMobileBrand);

    return router;
};