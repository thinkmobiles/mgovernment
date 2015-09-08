var CONST = require('../constants/index');
var RESPONSE = require('../constants/response');
var TRA = require('../constants/traServices');

var SessionHandler = require('./sessions');
var TraCrmNetWrapper = require('./crmNetWrapper/traCrmNetWrapper');
var async = require('async');

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
    var validation = require('../helpers/validation');
    var mailer = require('../helpers/mailer');
    var path = require('path');
    var Attachment = db.model(CONST.MODELS.ATTACHMENT);

    this.signInClient = function (req, res, next) {

        var err;
        var loginOpt = {
            login: req.body.login,
            pass: req.body.pass
        };

        if (!req.body || !req.body.login || !req.body.pass) {
            err = new Error(RESPONSE.ON_ACTION.BAD_REQUEST);
            err.status = 400;

            return next(err);
        }

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
        var userData;
        var user;

        shaSum.update(pass);
        pass = shaSum.digest('hex');

        userData = {
            login: loginOpt.login,
            pass: pass,
            userType: CONST.USER_TYPE.CLIENT,
            profile: {}
        };

        user = new User(userData);
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
        var caseType = TRA.NO_CRM_ENUM.REGISTER;
        var validatesErrors;

        if (!validation.hasCaseTypeModel(caseType)) {
            return res.status(500).send({error: 'Error: There is no validate model for this caseType'});
        }
        validatesErrors =  validation.validateByCaseTypeModel(caseType,req.body);

        if (validatesErrors.length) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS + ': ' + validatesErrors.join(', ')});
        }

        if ((typeof body.state) !== "number") {
            body.state = parseInt(body.state);
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
    };

    this.updateProfile = function (req, res, next) {

        var body = req.body;
        var userId = req.session.uId;


        //var caseType = TRA.NO_CRM_ENUM.UPDATE_PROFILE;
        //var validatesErrors;
        //
        //if (!validation.hasCaseTypeModel(caseType)) {
        //    return res.status(500).send({error: 'Error: There is no validate model for this caseType'});
        //}
        //validatesErrors =  validation.validateByCaseTypeModel(caseType,req.body);
        //
        //if (validatesErrors.length) {
        //    return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS + ': ' + validatesErrors.join(', ')});
        //}

        if ((typeof body.state) !== "number") {
            body.state = parseInt(body.state);
        }

        body.country = TRA.CRM_ENUM.COUNTRY.UAE;

        //traCrmNetWrapper.registerCrm(body, function (err, result) {
        //    if (err) {
        //        return next(err);
        //    }
        //
        //    if (result == "Login is used") {
        //        return res.status(400).send({error: RESPONSE.AUTH.REGISTER_LOGIN_USED});
        //    }

        updateMiddlewareUser(userId, body, function (err, userModel) {
            //WARNING: no error handling - cause login has logic to create middleware user
            res.status(200).send({success: "success"});
        });
        //});
        //res.status(200).send({success: "success"});
    };

    this.getProfile = function (req, res, next) {
        var userId = req.session.uId;
        var profile = {};

        //var caseType = TRA.NO_CRM_ENUM.UPDATE_PROFILE;
        //var validatesErrors;
        //
        //if (!validation.hasCaseTypeModel(caseType)) {
        //    return res.status(500).send({error: 'Error: There is no validate model for this caseType'});
        //}
        //validatesErrors =  validation.validateByCaseTypeModel(caseType,req.body);
        //
        //if (validatesErrors.length) {
        //    return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS + ': ' + validatesErrors.join(', ')});
        //}

        //traCrmNetWrapper.registerCrm(body, function (err, result) {
        //    if (err) {
        //        return next(err);
        //    }
        //
        //    if (result == "Login is used") {
        //        return res.status(400).send({error: RESPONSE.AUTH.REGISTER_LOGIN_USED});
        //    }

        User
            .findOne({_id: userId})
            .exec(function (err, model) {
                if (err) {
                    console.log('Getting user profile error: ', err);
                    //return callback(err);
                    res.status(500).send({error: err});

                }

                if (model) {

                    profile.first = model.profile.firstName;
                    profile.last = model.profile.lastName;
                    profile.state = model.profile.state;
                    profile.streetAddress = model.profile.streetAddress;
                    profile.phone = model.profile.phone;
                    profile.avatar = null;

                    if (model.profile.avatar) {
                        profile.avatar = process.env.HOST + 'image/' + model.profile.avatar.toString();
                    }
                    res.status(200).send(profile);
                } else {
                    res.status(400).send({error: RESPONSE.ON_ACTION.NOT_FOUND});
                }
            });

        //});
        //res.status(200).send({success: "success"});
    };


    function registerMiddlewareUser(registerData, callback) {

        var pass = registerData.pass;
        var shaSum = crypto.createHash('sha256');
        var userData;
        var user;

        shaSum.update(pass);
        pass = shaSum.digest('hex');

        userData = {
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

        user = new User(userData);
        user
            .save(function (err, userModel) {
                if (err) {
                    return callback(err);
                }
                return callback(null, userModel);
            });
    }

    function updateMiddlewareUser(userId, updateData, callbackMain) {
        var tasks =[];
        var user;
        var avatarId;

        function  getUserById() {
            return function (callback) {
                User
                    .findOne({_id: userId})
                    .exec(function (err, model) {
                        if (err) {
                            return callback(err);
                        }

                        if (model) {
                            user = model.toJSON();
                            return callback(null);
                        } else {
                            return callback(new Error(RESPONSE.ON_ACTION.NOT_FOUND + ' with such _id '));
                        }
                    });
            }
        }

        function  saveAvatar() {
            return function (callback) {
                var avatarImg;
                var attachment = updateData.avatar;

                if (attachment) {
                    avatarImg = new Attachment({
                        attachment: attachment
                    });

                    avatarImg
                        .save(function (err, model) {
                            if (model) {
                                console.log('Avatar img saved:');
                                avatarId = model._id;
                            } else {
                                console.log('Avatar img saved: ', err);
                            }
                            return callback(null);
                        });
                } else {
                    console.log('No avatar loaded');
                    return callback(null);
                }
            }
        }

        function  updateUserById() {
            return function (callback) {

                user.profile.firstName = updateData.first;
                user.profile.lastName = updateData.last;
                user.profile.state = updateData.state;
                user.profile.streetAddress = updateData.streetAddress;
                user.profile.phone = updateData.phone;
                user.profile.updatedAt = new Date();

                if (avatarId){
                    user.profile.avatar = avatarId;
                }

                User
                    .findOneAndUpdate({_id: userId},{$set: {profile : user.profile}})
                    .exec(function (err, model) {
                        if (err) {
                            return callback(err);
                        }

                        if (model) {
                            return callback(null);
                        } else {
                            return callback(new Error(RESPONSE.ON_ACTION.NOT_FOUND + ' with such _id '));
                        }
                    });
            }
        }

        /// GET User profile
        tasks.push(getUserById());

        /// Save Avatar
        tasks.push(saveAvatar());

        /// Update User profile
        tasks.push(updateUserById());

        /// Async main process
        async.waterfall(tasks, function (err,results){
            if (err) {
                console.log('Update middleware profile with error: ',err);
            }
            console.log('Update middleware profile successfull');
            callbackMain(null);
        });
    };

    this.forgotPass = function(req, res, next) {
        var passToken = generateConfirmToken();
        var searchQuery = {
            'profile.email': req.body.email
        };
        var data = {
            token: passToken
        };

        if (!req.body || !req.body.email) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        User
            .findOneAndUpdate(searchQuery,data)
            .exec(function (err, model) {
                if (err) {
                    return res.status(400).send({error: err});
                }
                if (!model) {
                    return res.status(400).send({error: RESPONSE.AUTH.EMAIL_NOT_REGISTERED});
                }
                prepareChangePassEmail(model, passToken, function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send({success: RESPONSE.ON_ACTION.SUCCESS});
                });

            });
    };

    function prepareChangePassEmail(model, confirmToken, callback) {

        var templateName = 'public/templates/mail/changePassword.html';
        var from = 'testTRA  <' + TRA.EMAIL_COMPLAIN_FROM + '>';
        var resetUrl = process.env.HOST + 'crm/changeForgotPass/' + confirmToken;

        var mailOptions = {
            from: from,
            mailTo: model.profile.email,
            title: 'Reset password',
            templateName:templateName,
            templateData: {
                login: model.login,
                resetUrl: resetUrl
            }
        };

        mailer.sendReport(mailOptions, callback);
    }

    function generateConfirmToken() {
        var randomPass = require('../helpers/randomPass');
        return randomPass.generate();
    }

    this.changeForgotPassForm = function(req, res, next) {
        var token = req.params.token;
        var tokenRegExpstr = new RegExp( '^[' + CONST.ALPHABETICAL_FOR_TOKEN + ']+$');

        if (token.length < 30 || !tokenRegExpstr.test(token)) {
            return res.status(404).send();
        }

        User
            .findOne({'token': token})
            .exec(function (err, model) {

                if (err) {
                    return next(err);
                }
                if (!model) {
                    return res.status(404).send('Not found');
                }
                res.sendFile(path.resolve(__dirname + '/../public/templates/customElements/changePass.html'));
            });
    };

    this.changeForgotPass = function(req, res, next) {
        var newPass = req.body.newPass;
        var confirmPass = req.body.confirmPass;
        var token = req.params.token;
        var searchQuery = {
            token: token
        };
        var shaSum = crypto.createHash('sha256');
        var pass;
        var data;
        var tokenRegExpstr = new RegExp( '^[' + CONST.ALPHABETICAL_FOR_TOKEN + ']+$');

        shaSum.update(newPass);
        pass = shaSum.digest('hex');

        data = {
            pass: pass,
            token: null
        };

        //TODO password validation when customer will describe the requirements for a password
        if (newPass !== confirmPass) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS + ': password and confirmation are not equal'});
        }

        //TODO check this condition in future
        if (token.length < 30 || !tokenRegExpstr.test(token)) {
            return res.status(404).send();
        }

        User
            .findOneAndUpdate(searchQuery, data)
            .exec(function (err, model){
                if (err){
                    return res.status(500).send({error: err });
                }
                if (!model){
                    return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS + ': bad token'});
                }
                return res.send('The password was successfully changed');
            });
    };

    this.changePassBySession = function(req, res, next) {
        var oldPass = req.body.oldPass;
        var newPass = req.body.newPass;
        var confirmPass = req.body.confirmPass;
        var shaSum = crypto.createHash('sha256');
        var userId = req.session.uId;
        //var userCrmId = req.session.crmId;
        var searchQuery;
        var pass;
        var data;

        shaSum.update(oldPass);
        pass = shaSum.digest('hex');


        //TODO password validation when customer will describe the requirements for a password
        if (newPass !== confirmPass) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS + ': password and confirmation are not equal'});
        }

        searchQuery = {
            "_id": userId,
            pass: pass
        };

        shaSum = crypto.createHash('sha256');
        shaSum.update(newPass);
        newPass = shaSum.digest('hex');

        data = {
            pass: newPass
        };

        User
            .findOneAndUpdate(searchQuery, data)
            .exec(function (err, model){
                if (err){
                    return res.status(500).send({error: err });
                }
                if (!model){
                    return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS + ': bad old password'});
                }
                return res.status(200).send({success: RESPONSE.ON_ACTION.SUCCESS});
            });
    };

    this.complainSmsSpam = function (req, res, next) {

        var phoneSpam = req.body.phone;
        var description = req.body.description;
        var crmUserId = req.session.crmId;
        var caseType = TRA.CRM_ENUM.CASE_TYPE.SMS_SPAM;
        var caseOptions;
        var validatesErrors;

        if (!validation.hasCaseTypeModel(caseType)) {
            return res.status(500).send({error: 'Error: There is no validate model for this caseType'});
        }
        validatesErrors =  validation.validateByCaseTypeModel(caseType,req.body);

        if (validatesErrors.length) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS + ': ' + validatesErrors.join(', ')});
        }

        caseOptions = {
            contactId: crmUserId,
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
        var crmUserId = req.session.crmId;
        var caseType = TRA.CRM_ENUM.CASE_TYPE.COMPLAINT_SERVICE_PROVIDER;
        var attachmentData = null;
        var caseOptions;
        var validatesErrors;

        if (!validation.hasCaseTypeModel(caseType)) {
            return res.status(500).send({error: 'Error: There is no validate model for this caseType'});
        }
        validatesErrors =  validation.validateByCaseTypeModel(caseType,req.body);

        if (validatesErrors.length) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS + ': ' + validatesErrors.join(', ')});
        }

        if (!referenceNumber) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS + ': input reference number or "none"'});
        }

        if (req.body.attachment) {
            attachmentData = prepareAttachment(req.body.attachment);
        }

        caseOptions = {
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
        var crmUserId = req.session.crmId;
        var caseType = TRA.CRM_ENUM.CASE_TYPE.COMPLAINT_TRA;
        var attachmentData = null;
        var caseOptions;
        var validatesErrors;

        if (!validation.hasCaseTypeModel(caseType)) {
            return res.status(500).send({error: 'Error: There is no validate model for this caseType'});
        }
        validatesErrors =  validation.validateByCaseTypeModel(caseType,req.body);

        if (validatesErrors.length) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS + ': ' + validatesErrors.join(', ')});
        }

        if (req.body.attachment) {
            attachmentData = prepareAttachment(req.body.attachment);
        }

        caseOptions = {
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
        var imageTypeRegularExpression = /\/(.*?)$/;
        var imageTypeDetected;

        if (!matches || matches.length !== 3) {
            imageData.type = 'image/png';
            imageData.data = dataString;
            imageData.extention = 'png';

        } else {
            imageData.type = matches[1];
            imageData.data = matches[2];

            imageTypeDetected = imageData
                .type
                .match(imageTypeRegularExpression);
            imageData.extention = imageTypeDetected[1];
        }
        return imageData;
    }

    this.complainInquiries = function (req, res, next) {

        var description = req.body.description;
        var title = req.body.title;
        var crmUserId = req.session.crmId;
        var caseType = TRA.CRM_ENUM.CASE_TYPE.INQUIRY;
        var attachmentData = null;
        var validatesErrors;

        if (!validation.hasCaseTypeModel(caseType)) {
            return res.status(500).send({error: 'Error: There is no validate model for this caseType'});
        }
        validatesErrors =  validation.validateByCaseTypeModel(caseType,req.body);

        if (validatesErrors.length) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS + ': ' + validatesErrors.join(', ')});
        }

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
        var crmUserId = req.session.crmId;
        var caseType = TRA.CRM_ENUM.CASE_TYPE.SUGGESTION;
        var attachmentData = null;
        var caseOptions;
        var validatesErrors;

        if (!validation.hasCaseTypeModel(caseType)) {
            return res.status(500).send({error: 'Error: There is no validate model for this caseType'});
        }
        validatesErrors =  validation.validateByCaseTypeModel(caseType,req.body);

        if (validatesErrors.length) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS + ': ' + validatesErrors.join(', ')});
        }

        if (req.body.attachment) {
            attachmentData = prepareAttachment(req.body.attachment);
        }

        caseOptions = {
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