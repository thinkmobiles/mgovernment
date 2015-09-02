var CONST = require('../constants');
var RESPONSE = require('../constants/response');
var TRA = require('../constants/traServices');

var request = require('request');
var SessionHandler = require('./sessions');

var TestTRAHandler = function (db) {
    'use strict';

    var mongoose = require('mongoose');
    var ObjectId = mongoose.Types.ObjectId;
    var mailer = require('../helpers/mailer');
    var validation = require('../helpers/validation');
    var session = new SessionHandler(db);
    var EmailReport = db.model(CONST.MODELS.EMAIL_REPORT);
    var Attachment = db.model(CONST.MODELS.ATTACHMENT);

    function emailReportAndAttachmentSave (res, emailReport, errMail) {

        var attachment = emailReport.attachment;
        var saveEmail = function() {
            emailReport
                .save(function (err, model) {
                    if (model) {
                        console.log('emailReport saved');
                    } else {
                        console.log('emailReport error saved: ', err);
                    }

                    if (errMail) {
                        console.error('err on Mail: ', errMail);
                        return res.status(500).send({error: errMail});
                    }

                    return res.status(200).send({success: RESPONSE.ON_ACTION.SUCCESS});
                });
        };

        if (attachment) {
            var attachmentImg = new Attachment({
                attachment: attachment
            });

            attachmentImg
                .save(function (err, model) {
                    if (model) {
                        console.log('Attachment saved:');
                        emailReport.set('attachment', model.toJSON()._id);

                    } else {
                        console.log('Attachment err saved: ', err);
                    }
                    saveEmail();
                });
        } else {
            saveEmail();
        }
    }

    this.complainSmsBlock = function (req, res, next) {

        var serviceType = 'SMS Block';
        var phoneSpam = req.body.phone;
        var phoneProvider = req.body.phoneProvider;
        var providerType = req.body.providerType;
        var description = req.body.description + ' / phoneProvider: ' + phoneProvider + ' / providerType: ' + providerType + ' /';
        var title = 'Block SMS Spam From ' + phoneSpam;
        var mailTo = TRA.EMAIL_COMPLAINSMSSPAM;
        var userId = null; //(req.session && req.session.uId) ? new ObjectId(req.session.uId) : null;
        var templateName = 'public/templates/mail/complainSmsBlock.html';
        var from = 'testTRA  <' + TRA.EMAIL_COMPLAIN_FROM + '>';
        var mailOptions = {
            templateData: {
                serviceType: serviceType,
                title: title,
                description: description,
                userId: userId
            },
            templateName: templateName,
            from: from,
            mailTo: mailTo,
            title: title
        };
        var caseType = TRA.NO_CRM_ENUM.CASE_TYPE.SMS_BLOCK;
        var validatesErrors;

        if (!validation.hasCaseTypeModel(caseType)) {
            return res.status(500).send({error: 'Error: There is no validate model for this caseType'});
        }

        validatesErrors =  validation.validateByCaseTypeModel(caseType,req.body);

        if (validatesErrors.length) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS + ': ' + validatesErrors.join(', ')});
        }

        mailer.sendReport(mailOptions, function (errMail, data) {

            //TODO remove console.logs

            var emailReport = new EmailReport({
                serviceType: serviceType,
                title: title,
                description: description,
                mailTo: mailTo,
                user: userId,
                response: data || errMail
            });

            emailReportAndAttachmentSave(res, emailReport, errMail);
        });
    };

    this.sendPoorCoverage = function (req, res, next) {

        var serviceType = 'Poor Coverage';
        var signalLevel = req.body.signalLevel;
        var location = req.body.location;
        var address = req.body.address;
        var title = (location && location.latitude && location.longitude)
            ? ('Location.latitude: ' + location.latitude + ', location.longitude: ' + location.longitude + ' Signal level: ' + signalLevel)
            :  "Address: " +address + ' Signal level: ' + signalLevel;
        var mailTo = TRA.EMAIL_COMPLAIN_POOR_COVERAGE;
        var userId = null; //(req.session && req.session.uId) ? new ObjectId(req.session.uId) : null;
        var templateName = 'public/templates/mail/poorCoverage.html';
        var from = 'testTRA  <' + TRA.EMAIL_COMPLAIN_FROM + '>';
        var mailOptions = {
            templateName: templateName,
            from: from,
            mailTo: mailTo,
            title: title,

            templateData: {
                location: location,
                signalLevel: signalLevel,
                address: address,
                userId: userId
            }
        };
        var caseType = TRA.NO_CRM_ENUM.CASE_TYPE.POOR_COVERAGE;
        var validatesErrors;

        if (!validation.hasCaseTypeModel(caseType)) {
            return res.status(500).send({error: 'Error: There is no validate model for this caseType'});
        }

        validatesErrors =  validation.validateByCaseTypeModel(caseType,req.body);

        if (validatesErrors.length) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS + ': ' + validatesErrors.join(', ')});
        }

        if (!((location && location.latitude && location.longitude) || address)) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS +': must be latitude and longitude or address'});
        }

        mailer.sendReport(mailOptions, function (errMail, data) {

            //TODO remove console.logs

            var emailReport = new EmailReport({
                address: address,
                location: location,
                signalLevel: signalLevel,
                title: title,
                serviceType: serviceType,
                mailTo: mailTo,
                user: userId,
                response: data || errMail
            });

            emailReportAndAttachmentSave(res, emailReport, errMail);
        });
    };

    this.sendHelpSalim = function (req, res, next) {

        var serviceType = 'Help Salim';
        var title = 'Complaint to site: ' + req.body.url;
        var description = req.body.description;
        var mailTo = TRA.EMAIL_HELP_SALIM;
        var userId = (req.session && req.session.uId) ? new ObjectId(req.session.uId) : null;
        var templateName = 'public/templates/mail/helpSalim.html';
        var from = 'testTRA  <' + TRA.EMAIL_COMPLAIN_FROM + '>';
        var mailOptions;
        var caseType = TRA.NO_CRM_ENUM.CASE_TYPE.HELP_SALIM;
        var validatesErrors;

        if (!validation.hasCaseTypeModel(caseType)) {
            return res.status(500).send({error: 'Error: There is no validate model for this caseType'});
        }

        validatesErrors =  validation.validateByCaseTypeModel(caseType,req.body);

        if (validatesErrors.length) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS + ': ' + validatesErrors.join(', ')});
        }

        mailOptions = {
            templateName: templateName,
            templateData: {
                serviceType: serviceType,
                title: title,
                description: description,
                userId: userId
            },
            from: from,
            mailTo: mailTo,
            title: title
        };

        mailer.sendReport(mailOptions, function (errMail, data) {

            //TODO remove console.logs

            var emailReport = new EmailReport({
                serviceType: serviceType,
                title: title,
                description: description,
                mailTo: mailTo,
                user: userId,
                response: data || errMail
            });

            emailReportAndAttachmentSave(res, emailReport, errMail);
        });
    };
};

module.exports = TestTRAHandler;