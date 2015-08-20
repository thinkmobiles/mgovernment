var CONST = require('../../constants/index');
var RESPONSE = require('../../constants/response');
var TRA = require('../../constants/traServices');

var request = require('request');
var SessionHandler = require('./../sessions');

var TestCRMNetHandler = function (db) {
    'use strict';

    var mongoose = require('mongoose');
    var ObjectId = mongoose.Types.ObjectId;

    this.getCases = function (req, res, next) {
        var edge = require('edge');

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
        var edge = require('edge');

        var path = __dirname + "\\";

        var connect = edge.func({
            source: function() {/*
             using System;
             using System.Threading.Tasks;

             using Microsoft.Crm.Sdk.Messages;
             using Microsoft.Xrm.Sdk.Query;

             using Microsoft.Xrm.Client;
             using Microsoft.Xrm.Client.Services;

             public class Startup
             {
             private OrganizationService _orgService;

             public async Task<object> Invoke(object input)
             {
             var connectionString = "Url=http://192.168.91.191/TRA; Domain=TRA; Username=crm.acc; Password=TRA_#admin;";
             // Establish a connection to the organization web service using CrmConnection.
             Microsoft.Xrm.Client.CrmConnection connection = CrmConnection.Parse(connectionString);

             // Obtain an organization service proxy.
             // The using statement assures that the service proxy will be properly disposed.
             using (_orgService = new OrganizationService(connection))
             {
             //Create any entity records this sample requires.
             //CreateRequiredRecords();

             // Obtain information about the logged on user from the web service.
             Guid userid = ((WhoAmIResponse)_orgService.Execute(new WhoAmIRequest())).UserId;
             //var systemUser = _orgService.Retrieve("systemuser", userid,
             //new ColumnSet(new string[] { "firstname", "lastname" }));
             //Console.WriteLine("Logged on user is {0} {1}.", systemUser.FirstName, systemUser.LastName);

             // Retrieve the version of Microsoft Dynamics CRM.
             RetrieveVersionRequest versionRequest = new RetrieveVersionRequest();
             RetrieveVersionResponse versionResponse =
             (RetrieveVersionResponse)_orgService.Execute(versionRequest);
             Console.WriteLine("Microsoft Dynamics CRM version {0}.", versionResponse.Version);

             return string.Format("Microsoft Dynamics CRM version {0}.", versionResponse.Version);
             }
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