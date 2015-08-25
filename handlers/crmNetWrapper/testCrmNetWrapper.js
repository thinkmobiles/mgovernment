var CONST = require('../../constants/index');
var RESPONSE = require('../../constants/response');
var TRA = require('../../constants/traServices');

var request = require('request');
var SessionHandler = require('./../sessions');

var REGISTER_FIELDS = [
    'login',
    'pass',
    'first',
    'last',
    'emiratesId',
    'address',
    'state',
    'landline',
    'mobile',
    'email'
];

var TestCRMNetHandler = function (db) {
    'use strict';

    var edge = require('edge');
    var sessionHandler = new SessionHandler(db);
    var mongoose = require('mongoose');

    this.getCases = function (req, res, next) {

        var helloWorld = edge.func(function () {/*
         async (input) => {
         return ".NET Welcomes " + input.ToString();
         }
         */
        });

        helloWorld('JavaScript', function (err, result) {
            if (err) {
                return next(err);
            }
            console.log(result);

            res.status(200).send(result);
        });
    };

    this.signInClient = function (req, res, next) {

        if (!req.body || !req.body.login || !req.body.pass) {
            var err = new Error(RESPONSE.ON_ACTION.BAD_REQUEST);
            err.status = 400;
            return next(err);
        }

        var loginOpt = {
            login: req.body.login,
            pass: req.body.pass
        };

        var path = __dirname + "\\";

        var signInFromNet = edge.func({
            source: function () {/*
             using System;
             using System.Threading.Tasks;

             using Microsoft.Crm.Sdk.Messages;
             using Microsoft.Xrm.Sdk;
             using Microsoft.Xrm.Client;
             using Microsoft.Xrm.Client.Services;
             using Microsoft.Xrm.Sdk.Metadata;
             using System.Collections.Generic;
             using Microsoft.Xrm.Sdk.Messages;
             using Microsoft.Xrm.Sdk.Client;
             using Microsoft.Xrm.Sdk.Query;

             public class Startup
             {
             private OrganizationService _orgService;
             private string _connectionString = "Url=http://192.168.91.232/TRA; Domain=TRA; Username=crm.acc; Password=TRA_#admin;";

             public class LoginResult
             {
             public string error = null;
             public string userId = null;
             }

             public async Task<object> Invoke(dynamic input)
             {
             string login = (string)input.login;
             string pass = (string)input.pass;

             Console.WriteLine("User login: {0}  pass: {1}", login, pass);

             CrmConnection connection = CrmConnection.Parse(_connectionString);

             using (_orgService = new OrganizationService(connection))
             {
             string contactId = FindContactId(_orgService, login, pass);

             var result = new LoginResult();

             if (contactId == null)
             {
             result.error = "Not Found";
             }
             else
             {
             result.userId = contactId;
             }

             return result;
             }
             }

             public static string FindContactId(OrganizationService service, string login, string pass)
             {
             QueryExpression qe = new QueryExpression();
             qe.EntityName = "contact";
             qe.ColumnSet = new ColumnSet();
             qe.ColumnSet.Columns.Add("contactid");
             qe.ColumnSet.Columns.Add("fullname");
             qe.ColumnSet.Columns.Add("tra_portalusername");
             qe.ColumnSet.Columns.Add("tra_password");

             FilterExpression filter = new FilterExpression();

             filter.FilterOperator = LogicalOperator.And;
             filter.AddCondition(new ConditionExpression("tra_portalusername", ConditionOperator.Equal, new object[] { login }));

             qe.Criteria = filter;

             EntityCollection ec = service.RetrieveMultiple(qe);
             Entity contact = null;

             Console.WriteLine("found count: {0}", ec.Entities.Count);

             if (ec.Entities.Count == 1)
             {
             contact = ec.Entities[0];

             string hash = new CRMDataManagement.PasswordHash().createHash(pass);

             Console.WriteLine("Found login: {0}  pass: {1}", contact["tra_portalusername"], contact["tra_password"]);
             Console.WriteLine("Hashed pass: {0}", hash);
             }

             if (contact == null)
             {
             return null;
             }
             else
             {
             string tra_pass = contact["tra_password"].ToString();
             if((new CRMDataManagement.PasswordHash().authenticatePassword(pass, tra_pass)))
             {
             string contactId = contact["contactid"].ToString();
             return contactId;
             }
             return null;
             }
             }

             }

             namespace CRMDataManagement
             {
             using System;
             using System.Text;
             using System.Security.Cryptography;

             public class TRAUtility
             {
             public const string STATUS_IMPLEMENTED_CODE = "4";
             public const string STATUS_WITHDRAWN_CODE = "3";
             public const string STATUS_STAGE_CLOSED = "4";
             public const string STATUS_PCR_AT_TRA = "1";
             public const string STATUS_CASE_INPROGRESS = "1";

             public const string STATUS_LICENSE_AT_TRA = "1";
             public const string STAGE_APPROVAL_REQUIRED_PROCESSING_TEAM = "2";

             public const string STATUS_APPROVED_LICENSE_REQUEST = "5";
             public const string STAGE_PAYMENT_RECIEVED = "7";

             // The following constants may be changed without breaking existing hashes.
             public const int SALT_BYTE_SIZE = 32;
             public const int HASH_BYTE_SIZE = 32;
             public const int PBKDF2_ITERATIONS = 1000;

             public const int ITERATION_INDEX = 0;
             public const int SALT_INDEX = 1;
             public const int PBKDF2_INDEX = 2;
             }

             public class PasswordHash
             {
             /// Creates a salted PBKDF2 hash of the password.
             public string createHash(string password)
             {
             // Generate a random salt
             RNGCryptoServiceProvider csprng = new RNGCryptoServiceProvider();
             byte[] salt = new byte[TRAUtility.SALT_BYTE_SIZE];
             csprng.GetBytes(salt);

             // Hash the password and encode the parameters
             byte[] hash = passwordBasedKeyDerivationFunction2(password, salt, TRAUtility.PBKDF2_ITERATIONS, TRAUtility.HASH_BYTE_SIZE);
             return TRAUtility.PBKDF2_ITERATIONS + ":" +
             Convert.ToBase64String(salt) + ":" +
             Convert.ToBase64String(hash);
             }


             /// Validates a password given a hash of the correct one.
             public bool authenticatePassword(string password, string correctHash)
             {
             // Extract the parameters from the hash
             char[] delimiter = { ':' };
             string[] split = correctHash.Split(delimiter);
             int iterations = Int32.Parse(split[TRAUtility.ITERATION_INDEX]);
             byte[] salt = Convert.FromBase64String(split[TRAUtility.SALT_INDEX]);
             byte[] hash = Convert.FromBase64String(split[TRAUtility.PBKDF2_INDEX]);

             byte[] testHash = passwordBasedKeyDerivationFunction2(password, salt, iterations, hash.Length);

             return slowEquals(hash, testHash);
             }


             /// Compares two byte arrays in length-constant time. This comparison
             /// method is used so that password hashes cannot be extracted from
             /// on-line systems using a timing attack and then attacked off-line.
             public bool slowEquals(byte[] a, byte[] b)
             {
             uint diff = (uint)a.Length ^ (uint)b.Length;
             for (int i = 0; i < a.Length && i < b.Length; i++)
             diff |= (uint)(a[i] ^ b[i]);
             return diff == 0;
             }


             /// Computes the PBKDF2-SHA1 hash of a password.
             public byte[] passwordBasedKeyDerivationFunction2(string password, byte[] salt, int iterations, int outputBytes)
             {
             Rfc2898DeriveBytes pbkdf2 = new Rfc2898DeriveBytes(password, salt);
             pbkdf2.IterationCount = iterations;
             return pbkdf2.GetBytes(outputBytes);
             }
             }
             }

             */
            },
            references: [
                'System.Data.dll',
                'System.ServiceModel.dll',
                'System.Configuration.dll',
                'System.Runtime.Serialization.dll',
                path + 'Microsoft.Xrm.Sdk.dll',
                path + 'Microsoft.Xrm.Sdk.Deployment.dll',
                path + 'Microsoft.IdentityModel.dll',
                path + 'Microsoft.Crm.Sdk.Proxy.dll',
                path + 'Microsoft.Xrm.Portal.Files.dll',
                path + 'Microsoft.Xrm.Portal.dll',
                path + 'Microsoft.Xrm.Client.dll',
                path + 'Microsoft.Xrm.Client.CodeGeneration.dll'
            ]
        });

        signInFromNet(loginOpt, function (err, result) {
            if (err) {
                return next(err);
            }

            console.log(result);

            if (result.error) {
                if (result.error === 'Not Found') {
                    return res.status(400).send({error: RESPONSE.AUTH.INVALID_CREDENTIALS});
                }
                return next(new Error(result.error));
            }

            if (!result.userId) {
                return res.status(400).send({error: RESPONSE.AUTH.INVALID_CREDENTIALS});
            }

            return sessionHandler.register(req, res, result.userId, CONST.USER_TYPE.CLIENT);
        });
    };

    this.signOutClient = function (req, res, next) {
        return sessionHandler.kill(req, res, next);
    };

    this.registerClient = function (req, res, next) {

        var body = req.body;
        var userType = CONST.USER_TYPE.CLIENT;

        validateRegisterData(body, function (errMsg) {
            if (errMsg) {
                return res.status(400).send({error: errMsg});
            }

            body.country = TRA.CRM_ENUM.COUNTRY.UAE;
            var path = __dirname + "\\";

            var registerClient = edge.func({
                source: function () {/*
                 using System;
                 using System.Threading.Tasks;

                 using Microsoft.Crm.Sdk.Messages;
                 using Microsoft.Xrm.Sdk;
                 using Microsoft.Xrm.Client;
                 using Microsoft.Xrm.Client.Services;
                 using Microsoft.Xrm.Sdk.Metadata;
                 using System.Collections.Generic;
                 using Microsoft.Xrm.Sdk.Messages;
                 using Microsoft.Xrm.Sdk.Client;
                 using Microsoft.Xrm.Sdk.Query;

                 public class Startup
                 {
                 private OrganizationService _orgService;
                 private string _connectionString = "Url=http://192.168.91.232/TRA; Domain=TRA; Username=crm.acc; Password=TRA_#admin;";

                 public async Task<object> Invoke(dynamic input)
                 {
                 string login = (string)input.login;

                 Console.WriteLine("User login: {0}", login);

                 CrmConnection connection = CrmConnection.Parse(_connectionString);

                 using (_orgService = new OrganizationService(connection))
                 {
                 string contactId = FindContactByLogin(_orgService, login);

                 if (contactId != null)
                 {
                 return "Login is used";
                 }

                 CreateContact(input, _orgService);

                 return "Created";
                 }
                 }

                 public static string FindContactByLogin(OrganizationService service, string login)
                 {
                 QueryExpression qe = new QueryExpression();
                 qe.EntityName = "contact";
                 qe.ColumnSet = new ColumnSet();
                 qe.ColumnSet.Columns.Add("contactid");
                 qe.ColumnSet.Columns.Add("fullname");
                 qe.ColumnSet.Columns.Add("tra_portalusername");

                 FilterExpression filter = new FilterExpression();

                 filter.FilterOperator = LogicalOperator.And;
                 filter.AddCondition(new ConditionExpression("tra_portalusername", ConditionOperator.Equal, new object[] { login }));

                 qe.Criteria = filter;

                 EntityCollection ec = service.RetrieveMultiple(qe);
                 Entity contact = null;

                 Console.WriteLine("found count: {0}", ec.Entities.Count);

                 if (ec.Entities.Count > 0)
                 {
                 contact = ec.Entities[0];
                 return contact["contactid"].ToString();
                 }
                 return null;
                 }

                 public static void CreateContact(dynamic contactData, OrganizationService orgService)
                 {
                 string login = (string)contactData.login;
                 string pass = (string)contactData.pass;
                 string email = (string)contactData.email;
                 string landline = (string)contactData.landline;
                 string mobile = (string)contactData.mobile;
                 string first = (string)contactData.first;
                 string last = (string)contactData.last;
                 string emiratesId = (string)contactData.emiratesId;
                 string address = (string)contactData.address;
                 int country = (int)contactData.country;
                 int state = (int)contactData.state;

                 Console.WriteLine("login before createt: {0}", login);

                 Entity contact = new Entity();
                 contact.LogicalName = "contact";

                 contact["tra_portalusername"] = login;
                 contact["tra_password"] = new CRMDataManagement.PasswordHash().createHash(pass);
                 contact["firstname"] = first;
                 contact["lastname"] = last;
                 contact["emailaddress1"] = email;
                 contact["telephone1"] = landline;
                 contact["mobilephone"] = mobile;
                 contact["tra_address"] = address;
                 contact["tra_emiratesid"] = emiratesId;
                 contact["tra_country"] = new OptionSetValue(country);
                 contact["tra_state"] = new OptionSetValue(state);

                 Console.WriteLine("Prepared data: {0}", login);

                 orgService.Create(contact);
                 }
                 }

                 namespace CRMDataManagement
                 {
                 using System;
                 using System.Security.Cryptography;

                 public class TRAUtility
                 {
                 public const string STATUS_IMPLEMENTED_CODE = "4";
                 public const string STATUS_WITHDRAWN_CODE = "3";
                 public const string STATUS_STAGE_CLOSED = "4";
                 public const string STATUS_PCR_AT_TRA = "1";
                 public const string STATUS_CASE_INPROGRESS = "1";

                 public const string STATUS_LICENSE_AT_TRA = "1";
                 public const string STAGE_APPROVAL_REQUIRED_PROCESSING_TEAM = "2";

                 public const string STATUS_APPROVED_LICENSE_REQUEST = "5";
                 public const string STAGE_PAYMENT_RECIEVED = "7";

                 // The following constants may be changed without breaking existing hashes.
                 public const int SALT_BYTE_SIZE = 32;
                 public const int HASH_BYTE_SIZE = 32;
                 public const int PBKDF2_ITERATIONS = 1000;

                 public const int ITERATION_INDEX = 0;
                 public const int SALT_INDEX = 1;
                 public const int PBKDF2_INDEX = 2;
                 }

                 public class PasswordHash
                 {
                 /// Creates a salted PBKDF2 hash of the password.
                 public string createHash(string password)
                 {
                 // Generate a random salt
                 RNGCryptoServiceProvider csprng = new RNGCryptoServiceProvider();
                 byte[] salt = new byte[TRAUtility.SALT_BYTE_SIZE];
                 csprng.GetBytes(salt);

                 // Hash the password and encode the parameters
                 byte[] hash = passwordBasedKeyDerivationFunction2(password, salt, TRAUtility.PBKDF2_ITERATIONS, TRAUtility.HASH_BYTE_SIZE);
                 return TRAUtility.PBKDF2_ITERATIONS + ":" +
                 Convert.ToBase64String(salt) + ":" +
                 Convert.ToBase64String(hash);
                 }

                 /// Validates a password given a hash of the correct one.
                 public bool authenticatePassword(string password, string correctHash)
                 {
                 // Extract the parameters from the hash
                 char[] delimiter = { ':' };
                 string[] split = correctHash.Split(delimiter);
                 int iterations = Int32.Parse(split[TRAUtility.ITERATION_INDEX]);
                 byte[] salt = Convert.FromBase64String(split[TRAUtility.SALT_INDEX]);
                 byte[] hash = Convert.FromBase64String(split[TRAUtility.PBKDF2_INDEX]);

                 byte[] testHash = passwordBasedKeyDerivationFunction2(password, salt, iterations, hash.Length);

                 return slowEquals(hash, testHash);
                 }

                 /// Compares two byte arrays in length-constant time. This comparison
                 /// method is used so that password hashes cannot be extracted from
                 /// on-line systems using a timing attack and then attacked off-line.
                 public bool slowEquals(byte[] a, byte[] b)
                 {
                 uint diff = (uint)a.Length ^ (uint)b.Length;
                 for (int i = 0; i < a.Length && i < b.Length; i++)
                 diff |= (uint)(a[i] ^ b[i]);
                 return diff == 0;
                 }

                 /// Computes the PBKDF2-SHA1 hash of a password.
                 public byte[] passwordBasedKeyDerivationFunction2(string password, byte[] salt, int iterations, int outputBytes)
                 {
                 Rfc2898DeriveBytes pbkdf2 = new Rfc2898DeriveBytes(password, salt);
                 pbkdf2.IterationCount = iterations;
                 return pbkdf2.GetBytes(outputBytes);
                 }
                 }
                 }
                 */
                },
                references: [
                    'System.Data.dll',
                    'System.ServiceModel.dll',
                    'System.Configuration.dll',
                    'System.Runtime.Serialization.dll',
                    path + 'Microsoft.Xrm.Sdk.dll',
                    path + 'Microsoft.Xrm.Sdk.Deployment.dll',
                    path + 'Microsoft.IdentityModel.dll',
                    path + 'Microsoft.Crm.Sdk.Proxy.dll',
                    path + 'Microsoft.Xrm.Portal.Files.dll',
                    path + 'Microsoft.Xrm.Portal.dll',
                    path + 'Microsoft.Xrm.Client.dll',
                    path + 'Microsoft.Xrm.Client.CodeGeneration.dll'
                ]
            });

            registerClient(body, function (err, result) {
                if (err) {
                    return next(err);
                }
                console.log(result);

                if (result == "Login is used") {
                    return res.status(400).send({error: RESPONSE.AUTH.REGISTER_LOGIN_USED});
                }

                res.status(200).send(result);
            });
        });
    };

    function validateRegisterData(data, callback) {
        for (var i = 0; i < REGISTER_FIELDS.length; i++) {
            if (!(REGISTER_FIELDS[i] in data)) {
                return callback(RESPONSE.NOT_ENOUGH_PARAMS + ': ' + REGISTER_FIELDS[i]);
            }
        }
        callback();
        //'784-YYYY-NNNNNNN-C'
    }

    this.complainSmsSpam = function (req, res, next) {

        var serviceType = 'SMS Spam';
        var phoneSpam = req.body.phone;
        var description = req.body.description;
        var userId = req.session.uId;
        var caseType = TRA.CRM_ENUM.CASE_TYPE.SMS_SPAM;

        var caseOptions = {
            contactId: userId,
            caseType: caseType,
            title: serviceType + ' from ' + phoneSpam,
            description: description
        };

        createCase(caseOptions, function (err, result) {
            if (err) {
                return next(err);
            }
            console.log(result);

            res.status(200).send(result);
        });
    };

    function createCase(options, callback) {

        options.connectionString = TRA.CRM_CONNECTION;

        var path = __dirname + "\\";

        var createCaseNet = edge.func({
            source: function () {/*
             using System;
             using System.Threading.Tasks;
             using Microsoft.Xrm.Sdk;
             using Microsoft.Xrm.Client;
             using Microsoft.Xrm.Client.Services;

             public class Startup
             {
             // "Url=http://192.168.91.232/TRA; Domain=TRA; Username=crm.acc; Password=TRA_#admin;";

             public async Task<object> Invoke(dynamic input)
             {
             OrganizationService orgService;
             string connectionString = (string)input.connectionString;

             string userContactId = (string)input.contactId;
             string title = (string)input.title;
             string description = (string)input.description;
             int caseType = (int)input.caseType;

             CrmConnection connection = CrmConnection.Parse(connectionString);
             using (orgService = new OrganizationService(connection))
             {
             Entity incident = new Entity();
             incident.LogicalName = "incident";

             incident["title"] = title;
             incident["description"] = description;
             incident["casetypecode"] = new OptionSetValue(caseType);

             Guid contactid = Guid.Parse(userContactId);
             EntityReference contactReference = new EntityReference("contact", contactid);
             incident["contactid"] = contactReference;
             incident["customerid"] = contactReference;

             orgService.Create(incident);

             return true;
             }
             }
             }
             */
            },
            references: [
                'System.Data.dll',
                'System.ServiceModel.dll',
                'System.Configuration.dll',
                'System.Runtime.Serialization.dll',
                path + 'Microsoft.Xrm.Sdk.dll',
                path + 'Microsoft.Xrm.Sdk.Deployment.dll',
                path + 'Microsoft.IdentityModel.dll',
                path + 'Microsoft.Crm.Sdk.Proxy.dll',
                path + 'Microsoft.Xrm.Portal.Files.dll',
                path + 'Microsoft.Xrm.Portal.dll',
                path + 'Microsoft.Xrm.Client.dll',
                path + 'Microsoft.Xrm.Client.CodeGeneration.dll'
            ]
        });

        createCaseNet(options, callback);
    }

};

module.exports = TestCRMNetHandler;