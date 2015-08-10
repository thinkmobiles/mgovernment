var CONST = require('../constants');
var RESPONSE = require('../constants/response');
var TRA = require('../constants/traServices');
var dynamics = require("dynamicscrm-api");
var request = require('request');

var TestTRACRMHandler = function (db) {
    'use strict';

    var dynamics = new dynamics({
        domain: TRA.CRM_URL,
        //organizationid: "e00000ee0e000e0e00ee0eeee0e0e0ee", //TODO GET IT
        timeout: 2*60*1000  // Timeout of 5 minutes
    });

    this.create = function (req, res, next) {

        var body = req.body;
        var crmAttributes = prepareCRMAttributes(body);
        var options = {};
        options.Attributes = crmAttributes;
        options.LogicalName = 'CASE';

        dynamics.Create(options, function(err, result) {

        });
    };

    var CASE_FIELDS = [
        'Title',
        'Description',
        'CaseTypeCode',
        'ContactId',
        'LicenseeReferenceNo',
        'Notes'
    ];

    function prepareCRMAttributes(bodyObject) {
        var crmAttributes = [];

        for (var key in bodyObject) {
            if (CASE_FIELDS.indexOf(key) > -1) {
                crmAttributes.push({
                    key: key,
                    value: bodyObject[key]
                });
            }
        }
        return crmAttributes;
    }
};

module.exports = TestTRACRMHandler;