var CONST = require('../../constants/index');
var RESPONSE = require('../../constants/response');
var TRA = require('../../constants/traServices');

var request = require('request');
var SessionHandler = require('./../sessions');

var CASE_TYPE = {
    COMPLAIN: 1,
    COMPLAIN_TRA: 2,
    SMS_SPAM: 3 //TODO Check and Complete
};

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
         */});

        helloWorld('JavaScript', function (err, result) {
            if (err) {
                return next(err);
            }
            console.log(result);

            res.status(200).send(result);
        });
    };

    this.connectCrm = function(req, res, next) {
        var path = __dirname + "\\";

        var connect = edge.func({
            source: function() {/*
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

             public class Person
             {
             public string accountid = "default_id";
             public string name = "default_name";
             public string email = "default_email";
             public string phone = "default_phone";
             }

             public async Task<object> InvokeFirst(object input)
             {
             // Establish a connection to the organization web service using CrmConnection.
             Microsoft.Xrm.Client.CrmConnection connection = CrmConnection.Parse(_connectionString);

             // Obtain an organization service proxy.
             // The using statement assures that the service proxy will be properly disposed.
             using (_orgService = new OrganizationService(connection))
             {
             //Create any entity records this sample requires.
             //CreateRequiredRecords();

             // Obtain information about the logged on user from the web service.
             Guid userid = ((WhoAmIResponse)_orgService.Execute(new WhoAmIRequest())).UserId;
             Console.WriteLine("UserId from guid {0}.", userid);
             //var systemUser = _orgService.Retrieve("systemuser", userid,
             //new ColumnSet(new string[] { "firstname", "lastname" }));
             //Console.WriteLine("Logged on user is {0} {1}.", systemUser.FirstName, systemUser.LastName);

             // Retrieve the version of Microsoft Dynamics CRM.
             RetrieveVersionRequest versionRequest = new RetrieveVersionRequest();
             RetrieveVersionResponse versionResponse =
             (RetrieveVersionResponse)_orgService.Execute(versionRequest);
             Console.WriteLine("Microsoft Dynamics CRM version {0}.", versionResponse.Version);

             //return string.Format("Microsoft Dynamics CRM version {0}.", versionResponse.Version);

             //return GetEntities(_orgService);
             return GetAccountNames(_orgService);
             }
             }

             public static string[] GetEntities(OrganizationService organizationService)
             {
             Dictionary<string, string> attributesData = new Dictionary<string, string>();
             RetrieveAllEntitiesRequest metaDataRequest = new RetrieveAllEntitiesRequest();
             RetrieveAllEntitiesResponse metaDataResponse = new RetrieveAllEntitiesResponse();
             metaDataRequest.EntityFilters = EntityFilters.All;

             // Execute the request.

             metaDataResponse = (RetrieveAllEntitiesResponse)organizationService.Execute(metaDataRequest);

             var entities = metaDataResponse.EntityMetadata;
             int len = entities.Length;

             string[] temp = new string[len];
             for(int i=0; i < len; i++)
             {
             temp[i] = entities[i].LogicalName;
             }
             return temp;
             }

             private static Person[] GetAccountNames(OrganizationService organizationService)
             {
             QueryExpression qe = new QueryExpression();
             qe.EntityName = "account";
             qe.ColumnSet = new ColumnSet();
             qe.ColumnSet.Columns.Add("accountid");
             qe.ColumnSet.Columns.Add("name");
             //qe.ColumnSet.Columns.Add("emailaddress1");
             //qe.ColumnSet.Columns.Add("telephone1");

             EntityCollection ec = organizationService.RetrieveMultiple(qe);

             Console.WriteLine("Retrieved {0} entities", ec.Entities.Count);
             Person[] temp = new Person[ec.Entities.Count];
             int i = 0;
             foreach (Entity act in ec.Entities)
             {
             Console.WriteLine("account name:" + act["name"]);
             var t = new Person();
             t.name = act["name"].ToString();
             t.accountid = act["accountid"].ToString();
             //t.email = act["emailaddress1"].ToString();
             //t.phone = act["telephone1"].ToString();
             temp[i] = t;
             i++;
             }

             return temp;
             }

             public async Task<object> Invoke(object input)
             {
             // Establish a connection to the organization web service using CrmConnection.
             Microsoft.Xrm.Client.CrmConnection connection = CrmConnection.Parse(_connectionString);

             // Obtain an organization service proxy.
             // The using statement assures that the service proxy will be properly disposed.
             using (_orgService = new OrganizationService(connection))
             {
             Entity incident = new Entity();
             incident.LogicalName = "incident";

             incident["title"] = "TEST Case subject 222";
             incident["description"] = "TEST description";
             incident["casetypecode"] = new OptionSetValue(1);

             Guid contactid = Guid.Parse(GetContactId(_orgService));

             // EntityReference customerReference = new EntityReference("contact", contactid);
             //crmCase.CustomerId = customerReference;

             EntityReference contactReference = new EntityReference("contact", contactid);
             incident["contactid"] = contactReference;
             incident["customerid"] = contactReference;

             _orgService.Create(incident);

             return "ok";
             }
             }

             public static String GetContactId(OrganizationService service)
             {
             QueryExpression qe = new QueryExpression();
             qe.EntityName = "contact";
             qe.ColumnSet = new ColumnSet();
             qe.ColumnSet.Columns.Add("contactid");
             qe.ColumnSet.Columns.Add("fullname");
             qe.ColumnSet.Columns.Add("emailaddress1");
             qe.ColumnSet.Columns.Add("telephone1");

             EntityCollection ec = service.RetrieveMultiple(qe);

             Console.WriteLine("Retrieved {0} entities", ec.Entities.Count);
             int len = ec.Entities.Count > 20 ? 20 : ec.Entities.Count;
             Person[] temp = new Person[ec.Entities.Count];
             for (int i = 0; i < len; i++)
             {
             Entity contact = ec.Entities[i];
             Console.WriteLine("contact name:" + contact["fullname"] + " - contact id: " + contact["contactid"]);

             var t = new Person();
             t.accountid = contact["contactid"].ToString();
             if (contact.Contains("fullname"))
             {
             t.name = contact["fullname"].ToString();
             }
             if (contact.Contains("emailaddress1"))
             {
             t.email = contact["emailaddress1"].ToString();
             }
             if (contact.Contains("telephone1"))
             {
             t.phone = contact["telephone1"].ToString();
             }
             temp[i] = t;
             }

             return temp[0].accountid;
             }
             }
        */},
            references: [
                'System.Data.dll',
                'System.ServiceModel.dll',
                'System.Configuration.dll',
                //'PresentationFramework.dll',
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

        connect('JavaScript', function (err, result) {
            if (err) {
                return next(err);
            }
            console.log(result);

            res.status(200).send(result);
        });
    };

    this.signInClient = function(req, res, next) {

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

    this.signOutClient = function(req, res, next) {
        res.status(500).send('Not implemented');
    };

    this.registerClient = function(req, res, next) {
        res.status(500).send('Not implemented');
    };

    this.complainSmsSpam = function (req, res, next) {

        var serviceType = 'SMS Spam';
        var phoneSpam = req.body.phone;
        var description = req.body.description;
        var userId = req.session.uId;

        var caseType = 1;//TODO const

        var caseOptions = {
            contactId: userId,
            caseType: caseType,
            title: serviceType + ' from ' + phoneSpam,
            description: description
        };

        var createCase = edge.func(function () {/*
         async (input) => {
         return ".NET Welcomes " + input.ToString();
         }
         */});

        createCase(caseOptions, function (err, result) {
            if (err) {
                return next(err);
            }
            console.log(result);

            res.status(200).send(result);
        });
    };

};

module.exports = TestCRMNetHandler;