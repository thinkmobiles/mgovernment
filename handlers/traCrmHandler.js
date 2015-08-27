var CONST = require('../constants/index');
var RESPONSE = require('../constants/response');
var TRA = require('../constants/traServices');

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

            traCrmNetWrapper.registerCrm(body, function (err, result) {
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

        var phoneSpam = req.body.phone;
        var description = req.body.description;
        var userId = req.session.uId;
        var caseType = TRA.CRM_ENUM.CASE_TYPE.SMS_SPAM;

        if (!phoneSpam || !description) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        var caseOptions = {
            contactId: userId,
            caseType: caseType,
            title: 'SMS Spam from ' + phoneSpam,
            description: description,
            attachment: null,
            attachmentName: null
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

        var userId = req.session.uId;
        var caseType = TRA.CRM_ENUM.CASE_TYPE.COMPLAINT_SERVICE_PROVIDER;
        var attachmentData = null;

        if (req.body.attachment) {
            attachmentData = prepareAttachment(req.body.attachment);
        }

        var caseOptions = {
            contactId: userId,
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

        var userId = req.session.uId;
        var caseType = TRA.CRM_ENUM.CASE_TYPE.COMPLAINT_TRA;
        var attachmentData = null;

        if (req.body.attachment) {
            attachmentData = prepareAttachment(req.body.attachment);
        }

        var caseOptions = {
            contactId: userId,
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

        var userId = req.session.uId;
        var caseType = TRA.CRM_ENUM.CASE_TYPE.INQUIRY;
        var attachmentData = null;

        if (req.body.attachment) {
            attachmentData = prepareAttachment(req.body.attachment);
        }

        var caseOptions = {
            contactId: userId,
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

        var userId = req.session.uId;
        var caseType = TRA.CRM_ENUM.CASE_TYPE.COMPLAINT_TRA;
        var attachmentData = null;

        if (req.body.attachment) {
            attachmentData = prepareAttachment(req.body.attachment);
        }

        var caseOptions = {
            contactId: userId,
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