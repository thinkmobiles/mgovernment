var CONST = require('../../constants/index');
var RESPONSE = require('../../constants/response');
var TRA = require('../../constants/traServices');

var request = require('request');
var SessionHandler = require('./../sessions');

var TestCRMNetHandler = function (db) {
    'use strict';

    var edge = require('edge');
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Types.ObjectId;

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
    }

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

};

module.exports = TestCRMNetHandler;