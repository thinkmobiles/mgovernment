var CONST = require('../constants');
var RESPONSE = require('../constants/response');
var TRA = require('../constants/traServices');
var dynamics = require("dynamicscrm-api");
var request = require('request');

var ENTITY = {
    CASE:       'case',
    SUGGESTION: 'suggestion'
};

var CASE_FIELDS = [
    'Case Number',
    'Case Type',
    'Case Subject',
    'Description',
    'User',
    'Customer',
    'Priority'
];

var TestTRACRMHandler = function (db) {
    'use strict';

    var dynamics = new dynamics({
        domain: TRA.CRM_URL,
        //organizationid: "e00000ee0e000e0e00ee0eeee0e0e0ee", //TODO GET IT
        timeout: 2 * 60 * 1000  // Timeout of 5 minutes
    });

    this.create = function (req, res, next) {

        var body = req.body;
        var crmAttributes = prepareCRMAttributes(body);
        var options = {};
        options.Attributes = crmAttributes; //[{key:'lastname', value :'Doe'}, {key:'firstname', value :'John'}];
        options.LogicalName = ENTITY.CASE;

        dynamics.Create(options, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

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

    function auth(callback) {
        dynamics.Authenticate({username: TRA.CRM_USER, password: TRA.CRM_PASS}, function (err, result) {
            if (err) {
                console.error(err);
                return callback(err);
            }
            console.log(result.auth);
            return callback(null, result.auth);
        });
    }

    this.getCases = function (req, res, next) {
        var options = {};
        //options.id = '00000000-dddd-eeee-iiii-111111111111'; //Entity id - id for Case
        options.EntityName = 'Case';

        dynamics.Retrieve(options, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

    this.execute = function (req, res, next) {
        var options = {};
        options.RequestName = 'account'; //method name
        options.Parameters = [{}]; //Array of Key-Value strings with the method's parameters names and values

        dynamics.Execute(options, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };
};

module.exports = TestTRACRMHandler;