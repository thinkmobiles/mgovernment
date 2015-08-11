var CONST = require('../constants');
var RESPONSE = require('../constants/response');
var TRA = require('../constants/traServices');
var dynamicsCRM = require("dynamicscrm-api");
var request = require('request');

var https = require('https');
var url = require('url');

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

var CRM_HOST = 'do-crm15'; //http://192.168.91.232/
var CRM_PORT = 80;
var CRM_USER = '';
var CRM_PASS = '';

var CLIENT_ID = 'ab762716-544d-4aeb-a526-687b73838a33'; //TODO GET IT
var OAUTH_RESOURCE = 'TRA.crm.dynamics.com';
var REDIRECT_URI = process.env.HOST + '/crm/auth/callback';

var TestTRACRMHandler = function (db) {
    'use strict';

    /*var dynamics = new dynamicsCRM({
     domain: TRA.CRM_URL,
     organizationid: TRA.CRM_ORGANIZATION_UNIQUE_NAME, //TODO GET IT
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

     auth(function(err, result){
     if (err) {
     return next(err);
     }
     dynamics.Retrieve(options, function (err, result) {
     if (err) {
     return next(err);
     }
     res.status(200).send(result);
     });
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
     };*/

    this.getContacts = function (req, res, next) {

        var session = req.session;

        if (session.access_token) {
            getContactReq(session, function (err, result) {
                if (err) {
                    return next(err);
                }
                return res.status(200).send({data: result});
            });
        } else {
            return res.status(401).send('Unauthorized IN CRM')
            /*processAuth(function (err, auth) {
             if (err) {
             return next(err);
             }
             })*/
        }
    };

    function getContactReq(sess, callback) {
        var headers = {
            'Authorization': 'Bearer ' + sess.access_token,
            'Accept': 'application/json'
        };

        var options = {
            host: CRM_HOST,
            port: CRM_PORT,
            path: '/XRMServices/2011/OrganizationData.svc/ContactSet',
            method: 'GET',
            rejectUnauthorized: false,
            headers: headers
        };

        var reqGet = https.request(options, function (resGet) {

            resGet.on('data', function (d) {
                var json = JSON.parse(d);
                var records = json.d.results;

                callback(null, records)
            });

            reqGet.end();

            reqGet.on('error', function (err) {
                callback(err);
            });
        });
    }

    var sess; //TOOD Check

    this.authLogin = function (req, res, next) {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');

        var headers = {
            'Authorization': 'Bearer'
        };

        var options = {
            host: CRM_HOST,
            port: CRM_PORT,
            path: '/XRMServices/2011/OrganizationData.svc/web?SdkClientVersion=6.1.0.533',
            method: 'GET',
            rejectUnauthorized: false,
            headers: headers
        };

        //make the request - the authorization uri is returned in the www-authenticate header
        var reqGet = https.request(options, function (resGet) {

            var authHeader = resGet.headers['www-authenticate'];
            var authUri = authHeader.replace('Bearer authorization_uri=', '');

            if (authUri.indexOf(',') > 0) {
                authUri = authUri.substr(0, authUri.indexOf(','));
            }

            sess = req.session;
            sess.authuri = authUri;

            res.redirect(authUri + '?response_type=code&client_id=' + CLIENT_ID
                + '&resource=' + OAUTH_RESOURCE + '&redirect_uri=' + REDIRECT_URI);
        });
        reqGet.end();

        reqGet.on('error', function (err) {
            console.error(err);
            res.status(503).send(err);
        });
    };

    this.authCallback = function (req, res, next) {
        sess = req.session;

        var authCode = req.query.code;
        var authUri = sess.authuri;
        var parsedAuthUri = url.parse(authUri);

        var headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        var options = {
            host: parsedAuthUri.hostname,
            port: parsedAuthUri.port,
            path: '/adfs/oauth2/token',
            method: 'POST',
            rejectUnauthorized: false,
            headers: headers
        };

        var formvals = 'client_id=' + CLIENT_ID
            + '&redirect_uri=' + REDIRECT_URI
            + '&grant_type=authorization_code&code=' + authCode;

        var reqPost = https.request(options, function (resPost) {

            resPost.on('data', function (d) {
                var json = JSON.parse(d);

                if (json.error) {
                    res.write(json.error);
                }
                else {
                    sess.access_token = json.access_token;
                    sess.refresh_token = json.refresh_token;

                    res.redirect('/');
                }
            });
        });

        reqPost.write(formvals);
        reqPost.end();

        reqPost.on('error', function (e) {
            console.error(e);
            return res.status(500).send({error: e});
        });
    };

    this.loginHttp = function (req, res, next) {
        var reqOptions = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer'
            }
        };

        request('http://do-crm15/TRA/XRMServices/2011/OrganizationData.svc', reqOptions, function (err, resGet, body) {

            if (!err && resGet.statusCode == 200) {
                return res.status(200).send(resGet.body);
            }

            var authHeader = resGet.headers['www-authenticate'];
            var authUri = authHeader.replace('Bearer authorization_uri=', '');
            if (authUri.indexOf(',') > 0) {
                authUri = authUri.substr(0, authUri.indexOf(','));
            }

            sess = req.session;
            sess.authUri = authUri;
            res.redirect('http://' + authUri + '?response_type=code&client_id=' + CLIENT_ID
                + '&resource=' + OAUTH_RESOURCE + '&redirect_uri=' + REDIRECT_URI);


            //return res.status(500).send(err);
        });
    }
};

module.exports = TestTRACRMHandler;