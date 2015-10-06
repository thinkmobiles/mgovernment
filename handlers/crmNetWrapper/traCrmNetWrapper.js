var CONST = require('../../constants/index');
var TRA = require('../../constants/traServices');

var os = require('os');

var TestCRMNetHandler = function () {
    'use strict';

    var edge = require('edge');
    var path = __dirname + getOsSlash();

    function getOsSlash() {
        var osType = (os.type().split('_')[0]);
        var slash;
        switch (osType) {
            case "Windows":
                slash = "\\";
                break;
            case "Linux":
                slash = "\/";
                break;
            default:
                slash = "\/";
        }
        return slash;
    }

    this.signInCrm = function (options, callback) {
        options.connectionString = TRA.CRM_CONNECTION;
        signInCrmNet(options, callback);
    };

    var signInCrmNet = edge.func({
        source: function () {
            /*
             using System;
             using System.Threading.Tasks;
             using Microsoft.Xrm.Sdk;
             using Microsoft.Xrm.Client;
             using Microsoft.Xrm.Client.Services;
             using Microsoft.Xrm.Sdk.Query;

             public class Startup
             {
             public class LoginResult
             {
             public string error = null;
             public string userId = null;
             }

             public async Task<object> Invoke(dynamic input)
             {
             OrganizationService orgService;
             string connectionString = (string)input.connectionString;

             string login = (string)input.login;
             string pass = (string)input.pass;

             CrmConnection connection = CrmConnection.Parse(connectionString);

             using (orgService = new OrganizationService(connection))
             {
             string contactId = FindContactId(orgService, login, pass);

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
             }

             if (contact == null)
             {
             return null;
             }
             else
             {
             string tra_pass = contact["tra_password"].ToString();
             if ((new CRMDataManagement.PasswordHash().authenticatePassword(pass, tra_pass)))
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

    this.registerCrm = function (options, callback) {
        options.connectionString = TRA.CRM_CONNECTION;
        registerCrmNet(options, callback);
    };

    var registerCrmNet = edge.func({
        source: function () {
            /*
             using System;
             using System.Threading.Tasks;
             using Microsoft.Xrm.Sdk;
             using Microsoft.Xrm.Client;
             using Microsoft.Xrm.Client.Services;
             using Microsoft.Xrm.Sdk.Query;

             public class Startup
             {
             public async Task<object> Invoke(dynamic input)
             {
             OrganizationService orgService;
             string connectionString = (string)input.connectionString;

             string login = (string)input.login;
             string email = (string)input.email;

             CrmConnection connection = CrmConnection.Parse(connectionString);

             using (orgService = new OrganizationService(connection))
             {
             string findResult = FindContactByLoginOrEmail(orgService, login, email);

             if (findResult != null)
             {
             return findResult + " is used";
             }

             CreateContact(input, orgService);

             return "Created";
             }
             }

             public static string FindContactByLoginOrEmail(OrganizationService service, string login, string email)
             {
             QueryExpression qe = new QueryExpression();
             qe.EntityName = "contact";
             qe.ColumnSet = new ColumnSet();
             qe.ColumnSet.Columns.Add("contactid");
             qe.ColumnSet.Columns.Add("fullname");
             qe.ColumnSet.Columns.Add("tra_portalusername");
             qe.ColumnSet.Columns.Add("emailaddress1");

             FilterExpression filter = new FilterExpression();

             filter.FilterOperator = LogicalOperator.Or;
             filter.AddCondition(new ConditionExpression("tra_portalusername", ConditionOperator.Equal, new object[] { login }));
             filter.AddCondition(new ConditionExpression("emailaddress1", ConditionOperator.Equal, new object[] { email }));

             qe.Criteria = filter;

             EntityCollection ec = service.RetrieveMultiple(qe);
             Entity contact = null;

             Console.WriteLine("found count: {0}", ec.Entities.Count);

             if (ec.Entities.Count > 0)
             {
             contact = ec.Entities[0];

             if (contact["tra_portalusername"].ToString() == login)
             {
             return "Login";
             }
             else
             {
             return "Email";
             }
             }
             return null;
             }

             public static void CreateContact(dynamic contactData, OrganizationService orgService)
             {
             string login = (string)contactData.login;
             string pass = (string)contactData.pass;
             string email = (string)contactData.email;
             string mobile = (string)contactData.mobile;
             string first = (string)contactData.first;
             string last = (string)contactData.last;
             string emiratesId = (string)contactData.emiratesId;
             int country = (int)contactData.country;
             int state = (int)contactData.state;

             Entity contact = new Entity();
             contact.LogicalName = "contact";

             contact["tra_portalusername"] = login;
             contact["tra_password"] = new CRMDataManagement.PasswordHash().createHash(pass);
             contact["firstname"] = first;
             contact["lastname"] = last;
             contact["emailaddress1"] = email;
             contact["mobilephone"] = mobile;
             contact["tra_emiratesid"] = emiratesId;
             contact["tra_country"] = new OptionSetValue(country);
             contact["tra_state"] = new OptionSetValue(state);

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

    this.getProfile = function (options, callback) {
        options.connectionString = TRA.CRM_CONNECTION;
        getProfile(options, callback);
    };

    var getProfile = edge.func({
        source: function () {
            /*
             using System;
             using System.Threading.Tasks;
             using Microsoft.Xrm.Sdk;
             using Microsoft.Xrm.Client;
             using Microsoft.Xrm.Client.Services;
             using Microsoft.Xrm.Sdk.Query;

             public class Startup
             {
             public class ProfileResult
             {
             public string error = null;

             public string first = null;
             public string last = null;
             public string email = null;
             public string mobile = null;
             }

             public async Task<object> Invoke(dynamic input)
             {
             OrganizationService orgService;
             string connectionString = (string)input.connectionString;

             string userContactId = (string)input.contactId;

             CrmConnection connection = CrmConnection.Parse(connectionString);

             using (orgService = new OrganizationService(connection))
             {
             ProfileResult contactProfile = FindContactProfile(orgService, userContactId);

             if (contactProfile == null)
             {
             contactProfile = new ProfileResult();
             contactProfile.error = "Not Found";
             }

             return contactProfile;
             }
             }

             public static ProfileResult FindContactProfile(OrganizationService service, string contactId)
             {
             QueryExpression qe = new QueryExpression();
             qe.EntityName = "contact";
             qe.ColumnSet = new ColumnSet();
             qe.ColumnSet.Columns.Add("contactid");
             qe.ColumnSet.Columns.Add("firstname");
             qe.ColumnSet.Columns.Add("lastname");
             qe.ColumnSet.Columns.Add("emailaddress1");
             qe.ColumnSet.Columns.Add("mobilephone");
             qe.ColumnSet.Columns.Add("tra_portalusername");

             FilterExpression filter = new FilterExpression();

             filter.FilterOperator = LogicalOperator.And;
             filter.AddCondition(new ConditionExpression("contactid", ConditionOperator.Equal, new object[] { contactId }));

             qe.Criteria = filter;

             EntityCollection ec = service.RetrieveMultiple(qe);
             Entity contact = null;

             Console.WriteLine("found count: {0}", ec.Entities.Count);

             if (ec.Entities.Count == 1)
             {
             contact = ec.Entities[0];
             }

             if (contact == null)
             {
             return null;
             }
             else
             {
             var profile = new ProfileResult();

             profile.first = contact["firstname"].ToString();
             profile.last = contact["lastname"].ToString();
             profile.email = contact["emailaddress1"].ToString();
             profile.mobile = contact["mobilephone"].ToString();

             return profile;
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

    this.setProfile = function (options, callback) {
        options.connectionString = TRA.CRM_CONNECTION;
        setProfile(options, callback);
    };

    var setProfile = edge.func({
        source: function () {
            /*
             using System;
             using System.Threading.Tasks;
             using Microsoft.Xrm.Sdk;
             using Microsoft.Xrm.Client;
             using Microsoft.Xrm.Client.Services;
             using Microsoft.Xrm.Sdk.Query;

             public class Startup
             {
             public class ProfileResult
             {
             public string error = null;

             public string first = null;
             public string last = null;
             public string email = null;
             public string mobile = null;
             }

             public async Task<object> Invoke(dynamic input)
             {
             OrganizationService orgService;
             string connectionString = (string)input.connectionString;

             string userContactId = (string)input.contactId;

             string first = (string)input.first;
             string last = (string)input.last;
             string email = (string)input.email;
             string mobile = (string)input.mobile;

             CrmConnection connection = CrmConnection.Parse(connectionString);

             using (orgService = new OrganizationService(connection))
             {
             Entity contactProfileEntity = FindContactProfile(orgService, userContactId);
             ProfileResult contactProfile = null;

             if (contactProfileEntity == null)
             {
             contactProfile = new ProfileResult();
             contactProfile.error = "Not Found";
             }
             else
             {
             contactProfileEntity["firstname"] = first;
             contactProfileEntity["lastname"] = last;
             if (email != null)
             contactProfileEntity["emailaddress1"] = email;
             if (mobile != null)
             contactProfileEntity["mobilephone"] = mobile;

             orgService.Update(contactProfileEntity);

             contactProfile = new ProfileResult();

             contactProfile.first = contactProfileEntity["firstname"].ToString();
             contactProfile.last = contactProfileEntity["lastname"].ToString();
             contactProfile.email = contactProfileEntity["emailaddress1"].ToString();
             contactProfile.mobile = contactProfileEntity["mobilephone"].ToString();
             }

             return contactProfile;
             }
             }

             public static Entity FindContactProfile(OrganizationService service, string contactId)
             {
             QueryExpression qe = new QueryExpression();
             qe.EntityName = "contact";
             qe.ColumnSet = new ColumnSet();
             qe.ColumnSet.Columns.Add("contactid");
             qe.ColumnSet.Columns.Add("firstname");
             qe.ColumnSet.Columns.Add("lastname");
             qe.ColumnSet.Columns.Add("emailaddress1");
             qe.ColumnSet.Columns.Add("mobilephone");
             qe.ColumnSet.Columns.Add("tra_portalusername");

             FilterExpression filter = new FilterExpression();

             filter.FilterOperator = LogicalOperator.And;
             filter.AddCondition(new ConditionExpression("contactid", ConditionOperator.Equal, new object[] { contactId }));

             qe.Criteria = filter;

             EntityCollection ec = service.RetrieveMultiple(qe);
             Entity contact = null;

             Console.WriteLine("found count: {0}", ec.Entities.Count);

             if (ec.Entities.Count == 1)
             {
             contact = ec.Entities[0];
             }

             if (contact == null)
             {
             return null;
             }
             else
             {
             return contact;
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

    this.changePass = function (options, callback) {
        options.connectionString = TRA.CRM_CONNECTION;
        changePass(options, callback);
    };

    var changePass = edge.func({
        source: function () {
        /*
         using System;
         using System.Threading.Tasks;
         using Microsoft.Xrm.Sdk;
         using Microsoft.Xrm.Client;
         using Microsoft.Xrm.Client.Services;
         using Microsoft.Xrm.Sdk.Query;

         public class Startup
         {
         public async Task<object> Invoke(dynamic input)
         {
         OrganizationService orgService;
         string connectionString = (string)input.connectionString;

         string userContactId = (string)input.contactId;

         string oldPass = (string)input.oldPass;
         string newPass = (string)input.newPass;

         CrmConnection connection = CrmConnection.Parse(connectionString);

         using (orgService = new OrganizationService(connection))
         {
         Entity contactProfileEntity = FindContactProfile(orgService, userContactId);

         if (contactProfileEntity == null)
         {
         return "Not Found";
         }
         else
         {
         string tra_pass = contactProfileEntity["tra_password"].ToString();
         if ((new CRMDataManagement.PasswordHash().authenticatePassword(oldPass, tra_pass)))
         {
         contactProfileEntity["tra_password"] = new CRMDataManagement.PasswordHash().createHash(newPass);
         orgService.Update(contactProfileEntity);

         return "Success";
         }
         else
         {
         return "Not Correct Previous Password";
         }
         }
         }
         }

         public static Entity FindContactProfile(OrganizationService service, string contactId)
         {
         QueryExpression qe = new QueryExpression();
         qe.EntityName = "contact";
         qe.ColumnSet = new ColumnSet();
         qe.ColumnSet.Columns.Add("contactid");
         qe.ColumnSet.Columns.Add("firstname");
         qe.ColumnSet.Columns.Add("lastname");
         qe.ColumnSet.Columns.Add("emailaddress1");
         qe.ColumnSet.Columns.Add("mobilephone");
         qe.ColumnSet.Columns.Add("tra_portalusername");
         qe.ColumnSet.Columns.Add("tra_password");

         FilterExpression filter = new FilterExpression();

         filter.FilterOperator = LogicalOperator.And;
         filter.AddCondition(new ConditionExpression("contactid", ConditionOperator.Equal, new object[] { contactId }));

         qe.Criteria = filter;

         EntityCollection ec = service.RetrieveMultiple(qe);
         Entity contact = null;

         Console.WriteLine("found count: {0}", ec.Entities.Count);

         if (ec.Entities.Count == 1)
         {
         contact = ec.Entities[0];
         }

         if (contact == null)
         {
         return null;
         }
         else
         {
         return contact;
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

    this.processForgotPass = function (options, callback) {
        options.connectionString = TRA.CRM_CONNECTION;
        processForgotPassByEmail(options, callback);
    };

    var processForgotPassByEmail = edge.func({
        source: function() {
            /*
             using System;
             using System.Threading.Tasks;
             using Microsoft.Xrm.Sdk;
             using Microsoft.Xrm.Client;
             using Microsoft.Xrm.Client.Services;
             using Microsoft.Xrm.Sdk.Query;

             public class Startup
             {
             public async Task<object> Invoke(dynamic input)
             {
             OrganizationService orgService;
             string connectionString = (string)input.connectionString;

             string email = (string)input.email;
             string temporaryPass = (string)input.tempPass;

             CrmConnection connection = CrmConnection.Parse(connectionString);

             using (orgService = new OrganizationService(connection))
             {
             Entity contactProfileEntity = FindContactProfileByEmail(orgService, email);

             if (contactProfileEntity == null)
             {
             return "Not Found";
             }
             else
             {
             contactProfileEntity["tra_password"] = new CRMDataManagement.PasswordHash().createHash(temporaryPass);
             orgService.Update(contactProfileEntity);

             return "Success";
             }
             }
             }

             public static Entity FindContactProfileByEmail(OrganizationService service, string email)
             {
             QueryExpression qe = new QueryExpression();
             qe.EntityName = "contact";
             qe.ColumnSet = new ColumnSet();
             qe.ColumnSet.Columns.Add("contactid");
             qe.ColumnSet.Columns.Add("firstname");
             qe.ColumnSet.Columns.Add("lastname");
             qe.ColumnSet.Columns.Add("emailaddress1");
             qe.ColumnSet.Columns.Add("mobilephone");
             qe.ColumnSet.Columns.Add("tra_portalusername");
             qe.ColumnSet.Columns.Add("tra_password");

             FilterExpression filter = new FilterExpression();

             filter.FilterOperator = LogicalOperator.And;
             filter.AddCondition(new ConditionExpression("emailaddress1", ConditionOperator.Equal, new object[] { email }));

             qe.Criteria = filter;

             EntityCollection ec = service.RetrieveMultiple(qe);
             Entity contact = null;

             Console.WriteLine("found count: {0}", ec.Entities.Count);

             if (ec.Entities.Count == 1)
             {
             contact = ec.Entities[0];
             }

             if (contact == null)
             {
             return null;
             }
             else
             {
             return contact;
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

    this.getTransactions = function (options, callback) {
        options.connectionString = TRA.CRM_CONNECTION;
        getUserTransactions(options, callback);
    };

    var getUserTransactions = edge.func({
        source: function () {
            /*
             using System;
             using System.Threading.Tasks;
             using Microsoft.Xrm.Sdk;
             using Microsoft.Xrm.Client;
             using Microsoft.Xrm.Client.Services;
             using Microsoft.Xrm.Sdk.Query;

             public class Startup
             {
             public class CasesResult
             {
             public string error = null;

             public object[] transactions = new object[0];
             }

             public class Transaction
             {
             public string title = null;
             public string description = null;
             public string type = null;

             public string traSubmitDatetime = null;
             public string modifiedDatetime = null;

             public string stateCode = null;
             public string statusCode = null;
             public string traStatus = null;
             public string serviceStage = null;
             }

             public async Task<object> Invoke(dynamic input)
             {
             OrganizationService orgService;
             string connectionString = (string)input.connectionString;

             string userContactId = (string)input.contactId;
             int page = (int)input.page;
             int count = (int)input.count;
             string orderBy = (string)input.orderBy;
             bool orderAsc = (bool)input.orderAsc;

             CrmConnection connection = CrmConnection.Parse(connectionString);

             using (orgService = new OrganizationService(connection))
             {
             EntityCollection userCases = FindCasesForUser(orgService, userContactId, page, count, orderBy, orderAsc);
             CasesResult caseResult = new CasesResult();

             if (userCases != null)
             {
             caseResult.transactions = new object[userCases.Entities.Count];

             for (int i = 0; i < userCases.Entities.Count; i++)
             {
             Transaction tr = new Transaction();

             tr.title = userCases.Entities[i]["title"].ToString();
             tr.description = userCases.Entities[i]["description"].ToString();
             tr.type = userCases.Entities[i].FormattedValues["casetypecode"].ToString();
             tr.stateCode = userCases.Entities[i].FormattedValues["statecode"].ToString();
             tr.statusCode = userCases.Entities[i].FormattedValues["statuscode"].ToString();
             tr.serviceStage = userCases.Entities[i].FormattedValues["servicestage"].ToString();
             tr.traStatus = userCases.Entities[i].FormattedValues["tra_casestatus"].ToString();
             tr.traSubmitDatetime = userCases.Entities[i]["tra_trasubmitdate"].ToString();
             tr.modifiedDatetime = userCases.Entities[i]["modifiedon"].ToString();

             caseResult.transactions[i] = tr;
             }
             }

             return caseResult;
             }
             }

             public static EntityCollection FindCasesForUser(OrganizationService service, string userContactId, int page, int count, string orderBy, bool orderAsc)
             {
             QueryExpression qe = new QueryExpression();
             qe.EntityName = "incident";
             qe.ColumnSet = new ColumnSet(true);

             qe.PageInfo = new PagingInfo();
             qe.PageInfo.Count = count;
             qe.PageInfo.PageNumber = page;

             FilterExpression filter = new FilterExpression();

             filter.FilterOperator = LogicalOperator.And;
             filter.AddCondition(new ConditionExpression("customerid", ConditionOperator.Equal, new object[] { userContactId }));

             qe.Criteria = filter;
             qe.Orders.Add(new OrderExpression(orderBy, orderAsc ? OrderType.Ascending : OrderType.Descending));

             EntityCollection ec = service.RetrieveMultiple(qe);
             Console.WriteLine("found count: {0}", ec.Entities.Count);

             if (ec.Entities.Count > 0)
             {
             return ec;
             }

             return null;
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

    this.createCase = function (options, callback) {
        options.connectionString = TRA.CRM_CONNECTION;
        createCaseNet(options, callback);
    };

    var createCaseNet = edge.func({
        source: function () {
            /*
             using System;
             using System.Threading.Tasks;
             using Microsoft.Xrm.Sdk;
             using Microsoft.Xrm.Client;
             using Microsoft.Xrm.Client.Services;
             using Microsoft.Xrm.Sdk.Query;

             public class Startup
             {
             public async Task<object> Invoke(dynamic input)
             {
             OrganizationService orgService;
             string connectionString = (string)input.connectionString;

             string userContactId = (string)input.contactId;
             string title = (string)input.title;
             string description = (string)input.description;
             int caseType = (int)input.caseType;
             string attachment = (string)input.attachment;
             string licensee = (string)input.licensee;

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

             if (licensee != null && !string.IsNullOrWhiteSpace(licensee))
             {

             string licenseeReferenceNo = (string)input.licenseeReferenceNo;
             string foundLicenseeId = FindLicenseId(orgService, licensee);

             if (foundLicenseeId != null)
             {
             Guid licenseeId = Guid.Parse(foundLicenseeId);
             EntityReference licenseeReference = new EntityReference("tra_licensee", licenseeId);

             incident["tra_licensee"] = licenseeReference;
             incident["tra_licenseereferenceno"] = licenseeReferenceNo;
             }
             }

             Guid incidentId = orgService.Create(incident);

             if (attachment != null && !string.IsNullOrWhiteSpace(attachment))
             {
             string attachmentName = (string)input.attachmentName;
             Entity note = new Entity();
             note.LogicalName = "annotation";
             note["objectid"] = new EntityReference("incident", incidentId);
             note["documentbody"] = attachment;
             note["filename"] = attachmentName;
             orgService.Create(note);
             }
             return true;
             }
             }

             public string FindLicenseId(OrganizationService service, string licensee)
             {
             Console.WriteLine("In start find licensee: {0}", licensee);
             QueryExpression qe = new QueryExpression();
             qe.EntityName = "tra_licensee";
             qe.ColumnSet = new ColumnSet();
             qe.ColumnSet.Columns.Add("tra_licenseeid");
             qe.ColumnSet.Columns.Add("tra_firstname");
             Console.WriteLine("licensee: {0}", licensee);

             FilterExpression filter = new FilterExpression();

             filter.FilterOperator = LogicalOperator.And;
             filter.AddCondition(new ConditionExpression("tra_firstname", ConditionOperator.Equal, new object[] { licensee }));

             qe.Criteria = filter;

             EntityCollection ec = service.RetrieveMultiple(qe);
             Console.WriteLine("license count: {0}", ec.Entities.Count);

             if (ec.Entities.Count > 0)
             {
             Entity contact = ec.Entities[0];
             return contact["tra_licenseeid"].ToString();
             }

             return null;
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

};

module.exports = TestCRMNetHandler;