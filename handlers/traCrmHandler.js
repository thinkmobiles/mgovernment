var CONST = require('../constants/index');
var RESPONSE = require('../constants/response');
var TRA = require('../constants/traServices');

var RandomPass = require('../helpers/randomPass');
var SessionHandler = require('./sessions');
var TraCrmNetWrapper = require('./crmNetWrapper/traCrmNetWrapper');

var REGISTER_FIELDS = [
    'login',
    'pass',
    'first',
    'last',
    'emiratesId',
    'state',
    'mobile',
    'email'
];

var TRACRMHandler = function (db) {
    'use strict';

    var sessionHandler = new SessionHandler(db);
    var traCrmNetWrapper = new TraCrmNetWrapper();
    var mongoose = require('mongoose');
    var crypto = require('crypto');
    var User = db.model(CONST.MODELS.USER);

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

        traCrmNetWrapper.signInCrm(loginOpt, function (err, result) {

            if (err) {
                return next(err);
            }

            if (result.error) {
                if (result.error === 'Not Found') {
                    return res.status(400).send({error: RESPONSE.AUTH.INVALID_CREDENTIALS});
                }
                return next(new Error(result.error));
            }

            if (!result.userId) {
                return res.status(400).send({error: RESPONSE.AUTH.INVALID_CREDENTIALS});
            }

            loginOpt.crmId = result.userId;

            loginMiddleware(loginOpt, function(err, user) {
                if (err) {
                    return next(err);
                }

                return sessionHandler.register(req, res, user._id.toString(), user.userType, loginOpt.crmId);
            });
        });
    };

    function loginMiddleware(loginOpt, callback) {
        User
            .findOne({login: loginOpt.login})
            .exec(function (err, model) {
                if (err) {
                    return callback(err);
                }

                if (model) {
                    return callback(null, model);
                }

                createMiddlewareUser(loginOpt, callback);
            });
    }

    function createMiddlewareUser(loginOpt, callback){

        var pass = loginOpt.pass;
        var shaSum = crypto.createHash('sha256');
        shaSum.update(pass);
        pass = shaSum.digest('hex');

        var userData = {
            login: loginOpt.login,
            pass: pass,
            userType: CONST.USER_TYPE.CLIENT,
            profile: {}
        };

        var user = new User(userData);
        user
            .save(function (err, userModel) {
                if (err) {
                    return callback(err);
                }

                return callback(null, userModel);
            });
    }

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

            traCrmNetWrapper.registerCrm(body, function (err, result) {
                if (err) {
                    return next(err);
                }

                if (result == "Login is used") {
                    return res.status(400).send({error: RESPONSE.AUTH.REGISTER_LOGIN_USED});
                }

                registerMiddlewareUser(body, function (err, userModel) {
                    //WARNING: no error handling - cause login has logic to create middleware user
                    res.status(200).send({success: result});
                });
            });
        });
    };

    function validateRegisterData(data, callback) {
        for (var i = 0; i < REGISTER_FIELDS.length; i++) {
            if (!(REGISTER_FIELDS[i] in data)) {
                return callback(RESPONSE.NOT_ENOUGH_PARAMS + ': ' + REGISTER_FIELDS[i]);
            }
        }
        if ((typeof data.state) !== "number") {
            data.state = parseInt(data.state);
        }
        callback();
        //'784-YYYY-NNNNNNN-C'
    }

    function registerMiddlewareUser(registerData, callback) {

        var pass = registerData.pass;
        var shaSum = crypto.createHash('sha256');
        shaSum.update(pass);
        pass = shaSum.digest('hex');

        var userData = {
            login: registerData.login,
            pass: pass,
            userType: CONST.USER_TYPE.CLIENT,
            profile: {
                firstName: registerData.first,
                lastName: registerData.last,
                phone: registerData.mobile,
                email: registerData.email
            }
        };

        var user = new User(userData);
        user
            .save(function (err, userModel) {
                if (err) {
                    return callback(err);
                }

                return callback(null, userModel);
            });
    }

    this.getProfile = function (req, res, next) {
        var crmUserId = req.session.crmId;

        traCrmNetWrapper.getProfile({contactId: crmUserId}, function(err, result){
            if (err) {
                return next(err);
            }

            if (result.error) {
                if (result.error === 'Not Found') {
                    return res.status(400).send({error: RESPONSE.AUTH.INVALID_CREDENTIALS});
                }
                return next(new Error(result.error));
            }

            delete result.error;

            return res.status(200).send(result);
        });
    };

    this.setProfile = function (req, res, next) {
        var crmUserId = req.session.crmId;

        if (!req.body.first || !req.body.last) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        var profileOptions = {
            contactId: crmUserId,
            first: req.body.first,
            last: req.body.last,
            email: req.body.email ? req.body.email : null,
            mobile: req.body.mobile ? req.body.mobile : null
        };

        traCrmNetWrapper.setProfile(profileOptions, function (err, result) {
            if (err) {
                return next(err);
            }

            return res.status(200).send(result);
        });
    };

    this.changePass = function (req, res, next) {
        var crmUserId = req.session.crmId;

        if (!req.body.oldPass || !req.body.newPass) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        var changePassOptions = {
            contactId: crmUserId,
            oldPass: req.body.oldPass,
            newPass: req.body.newPass
        };

        traCrmNetWrapper.changePass(changePassOptions, function (err, result) {
            if (err) {
                return next(err);
            }

            if (result != 'Success') {
                return res.status(400).send({error: result});
            }

            return res.status(200).send({success: result});
        });
    };

    this.forgotPass = function (req, res, next) {

        if (!req.body.email) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        var tempPass = generateTempPass();

        var forgotPassOptions = {
            email: req.body.email,
            tempPass: tempPass
        };

        traCrmNetWrapper.processForgotPass(forgotPassOptions, function (err, result) {
            if (err) {
                return next(err);
            }

            if (!result.error) {
                return res.status(400).send({error: result.error});
            }

            return res.status(200).send({success: result});
        });
    };

    function generateTempPass() {
        return RandomPass.generate('alphabetical', 8);
    }

    this.getTransactions = function (req, res, next) {

        var userOptions = {
            contactId: req.session.crmId
        };

        traCrmNetWrapper.getTransactions(userOptions, function (err, result) {
            if (err) {
                return next(err);
            }

            if (!result.error) {
                return res.status(400).send({error: result.error});
            }

            return res.status(200).send({success: result.transactions});
        });
    };

    this.complainSmsSpam = function (req, res, next) {

        var phoneSpam = req.body.phone;
        var description = req.body.description;
        var crmUserId = req.session.crmId;
        var caseType = TRA.CRM_ENUM.CASE_TYPE.SMS_SPAM;

        if (!phoneSpam || !description) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        var caseOptions = {
            contactId: crmUserId,
            caseType: caseType,
            title: 'SMS Spam from ' + phoneSpam,
            description: description,
            attachment: null,
            attachmentName: null,
            licensee: null
        };

        traCrmNetWrapper.createCase(caseOptions, function (err, result) {
            if (err) {
                return next(err);
            }
            console.log(result);

            res.status(200).send({success: RESPONSE.ON_ACTION.SUCCESS});
        });
    };

    this.complainServiceProvider = function (req, res, next) {

        var description = req.body.description;
        var title = req.body.title;
        var serviceProvider = req.body.serviceProvider;
        var referenceNumber = req.body.referenceNumber;

        if (!title || !description) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        if (!serviceProvider) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS + ': service provider'});
        }

        if (!(serviceProvider == TRA.CRM_ENUM.SERVICE_PROVIDER.DU
            || serviceProvider == TRA.CRM_ENUM.SERVICE_PROVIDER.ETISALAT
            || serviceProvider == TRA.CRM_ENUM.SERVICE_PROVIDER.YAHSAT)) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS + ': service provider is not from allowed list'});
        }

        if (!referenceNumber) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS + ': input reference number or "none"'});
        }

        var crmUserId = req.session.crmId;
        var caseType = TRA.CRM_ENUM.CASE_TYPE.COMPLAINT_SERVICE_PROVIDER;
        var attachmentData = null;

        if (req.body.attachment) {
            attachmentData = prepareAttachment(req.body.attachment);
        }

        var caseOptions = {
            contactId: crmUserId,
            caseType: caseType,
            title: title,
            description: description,
            attachment: attachmentData ? attachmentData.data : null,
            attachmentName: attachmentData ? ('image.' + attachmentData.extention) : null,
            licensee: serviceProvider,
            licenseeReferenceNo: referenceNumber
        };

        traCrmNetWrapper.createCase(caseOptions, function (err, result) {
            if (err) {
                return next(err);
            }
            console.log(result);

            res.status(200).send({success: RESPONSE.ON_ACTION.SUCCESS});
        });
    };

    this.complainTRAService = function (req, res, next) {

        var description = req.body.description;
        var title = req.body.title;

        if (!title || !description) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        var crmUserId = req.session.crmId;
        var caseType = TRA.CRM_ENUM.CASE_TYPE.COMPLAINT_TRA;
        var attachmentData = null;

        if (req.body.attachment) {
            attachmentData = prepareAttachment(req.body.attachment);
        }

        var caseOptions = {
            contactId: crmUserId,
            caseType: caseType,
            title: title,
            description: description,
            attachment: attachmentData ? attachmentData.data : null,
            attachmentName: attachmentData ? ('image.' + attachmentData.extention) : null,
            licensee: null
        };

        traCrmNetWrapper.createCase(caseOptions, function (err, result) {
            if (err) {
                return next(err);
            }
            console.log(result);

            res.status(200).send({success: RESPONSE.ON_ACTION.SUCCESS});
        });
    };

    function prepareAttachment(dataString) {

        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        var imageData = {};

        if (!matches || matches.length !== 3) {

            imageData.type = 'image/png';
            imageData.data = dataString;
            imageData.extention = 'png';

        } else {
            imageData.type = matches[1];
            imageData.data = matches[2];

            var imageTypeRegularExpression = /\/(.*?)$/;
            var imageTypeDetected = imageData
                .type
                .match(imageTypeRegularExpression);
            imageData.extention = imageTypeDetected[1];
        }
        return imageData;
    }

    this.complainInquiries = function (req, res, next) {

        var description = req.body.description;
        var title = req.body.title;

        if (!title || !description) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        var crmUserId = req.session.crmId;
        var caseType = TRA.CRM_ENUM.CASE_TYPE.INQUIRY;
        var attachmentData = null;

        if (req.body.attachment) {
            attachmentData = prepareAttachment(req.body.attachment);
        }

        var caseOptions = {
            contactId: crmUserId,
            caseType: caseType,
            title: title,
            description: description,
            attachment: attachmentData ? attachmentData.data : null,
            attachmentName: attachmentData ? ('image.' + attachmentData.extention) : null,
            licensee: null
        };

        traCrmNetWrapper.createCase(caseOptions, function (err, result) {
            if (err) {
                return next(err);
            }
            console.log(result);

            res.status(200).send({success: RESPONSE.ON_ACTION.SUCCESS});
        });
    };

    this.sendSuggestion = function (req, res, next) {

        var description = req.body.description;
        var title = req.body.title;

        if (!title || !description) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        var crmUserId = req.session.crmId;
        var caseType = TRA.CRM_ENUM.CASE_TYPE.COMPLAINT_TRA;
        var attachmentData = null;

        if (req.body.attachment) {
            attachmentData = prepareAttachment(req.body.attachment);
        }

        var caseOptions = {
            contactId: crmUserId,
            caseType: caseType,
            title: title,
            description: description,
            attachment: attachmentData ? attachmentData.data : null,
            attachmentName: attachmentData ? ('image.' + attachmentData.extention) : null,
            licensee: null
        };

        traCrmNetWrapper.createCase(caseOptions, function (err, result) {
            if (err) {
                return next(err);
            }
            console.log(result);

            res.status(200).send({success: RESPONSE.ON_ACTION.SUCCESS});
        });
    };

};

module.exports = TRACRMHandler;