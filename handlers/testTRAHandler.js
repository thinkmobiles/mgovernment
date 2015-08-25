var CONST = require('../constants');
var RESPONSE = require('../constants/response');
var TRA = require('../constants/traServices');

var request = require('request');
var SessionHandler = require('./sessions');

var AVAILABLE_STATUS = {
    AVAILABLE: 'Available',
    NOT_AVAILABLE: 'Not Available',
    RESERVED: 'Reserved'
};

var NO_DATA_FOUND = '';

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
                        console.log('emailReport err saved: ', err);
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

    this.complainSmsSpam = function (req, res, next) {

        var serviceType = 'SMS Spam';
        var phoneSpam = req.body.phone;
        //var phoneProvider = req.body.phoneProvider;
        //var providerType = req.body.providerType;
        var description = req.body.description;
        var title = 'SMS Spam From ' + phoneSpam;
        var mailTo = TRA.EMAIL_COMPLAINSMSSPAM;
        var userId = (req.session && req.session.uId) ? new ObjectId(req.session.uId) : null;
        var templateName = 'public/templates/mail/complainSmsSpam.html';
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

    this.complainSmsBlock = function (req, res, next) {

        var serviceType = 'SMS Block';
        var phoneSpam = req.body.phone;
        var phoneProvider = req.body.phoneProvider;
        var providerType = req.body.providerType;
        var description = req.body.description + ' / phoneProvider: ' + phoneProvider + ' / providerType: ' + providerType + ' /';
        var title = 'Block SMS Spam From ' + phoneSpam;
        var mailTo = TRA.EMAIL_COMPLAINSMSSPAM;
        var userId = (req.session && req.session.uId) ? new ObjectId(req.session.uId) : null;
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

    this.complainServiceProvider = function (req, res, next) {

        var serviceType = 'Service Provider';
        var description = req.body.description;
        var title = req.body.title;

        if (!title || !description){
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        var mailTo = TRA.EMAIL_COMPLAIN_SERVICE_PROVIDER;
        var userId = (req.session && req.session.uId) ? new ObjectId(req.session.uId) : null;
        var serviceProvider = req.body.serviceProvider;
        var templateName = 'public/templates/mail/complainServiceProvider.html';
        var from = 'testTRA  <' + TRA.EMAIL_COMPLAIN_FROM + '>';
        var referenceNumber = req.body.referenceNumber;
        var attachment = req.body.attachment;

        var mailOptions = {
            templateData: {
                serviceProvider: serviceProvider,
                title: title,
                description: description,
                userId: userId,
                referenceNumber: referenceNumber
            },
            templateName: templateName,
            from: from,
            mailTo: mailTo,
            title: title,
            attachment: attachment
        };

        mailer.sendReport(mailOptions, function (errMail, data) {

            //TODO remove console.logs
            console.log(attachment);

            var emailReport = new EmailReport({
                attachment: attachment,
                serviceType: serviceType,
                serviceProvider: serviceProvider,
                title: title,
                description: description + ' referenceNumber:' + referenceNumber,
                mailTo: mailTo,
                user: userId,
                referenceNumber: referenceNumber,
                response: data || errMail
            });

            emailReportAndAttachmentSave(res, emailReport, errMail);
        });
    };

    this.complainTRAService = function (req, res, next) {

        var serviceType = 'TRA Service';
        var description = req.body.description;
        var title = req.body.title;

        if (!title || !description){
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        var mailTo = TRA.EMAIL_COMPLAIN_TRA_SERVICE;
        var userId = (req.session && req.session.uId) ? new ObjectId(req.session.uId) : null;
        var templateName = 'public/templates/mail/complainTRAService.html';
        var from = 'testTRA  <' + TRA.EMAIL_COMPLAIN_FROM + '>';
        var attachment = req.body.attachment;

        var mailOptions = {
            templateData: {
                title: title,
                description: description,
                userId: userId
            },
            templateName: templateName,
            from: from,
            mailTo: mailTo,
            title: title,
            attachment: attachment
        };

        mailer.sendReport(mailOptions, function (errMail, data) {

            //TODO remove console.logs

            var emailReport = new EmailReport({
                attachment: attachment,
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

    this.complainEnquiries = function (req, res, next) {

        var serviceType = 'Enquiries';
        var description = req.body.description;
        var title = req.body.title;

        if (!title || !description){
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        var mailTo = TRA.EMAIL_COMPLAIN_ENQUIRIES;
        var userId = (req.session && req.session.uId) ? new ObjectId(req.session.uId) : null;
        var templateName = 'public/templates/mail/complainEnquiries.html';
        var from = 'testTRA  <' + TRA.EMAIL_COMPLAIN_FROM + '>';
        var attachment = req.body.attachment;

        var mailOptions = {
            templateData: {
                title: title,
                description: description,
                userId: userId
            },
            templateName: templateName,
            from: from,
            mailTo: mailTo,
            title: title,
            attachment: attachment
        };

        mailer.sendReport(mailOptions, function (errMail, data) {

            //TODO remove console.logs

            var emailReport = new EmailReport({
                attachment: attachment,
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

    this.sendSuggestion = function (req, res, next) {

        var serviceType = 'Suggestion';
        var description = req.body.description;
        var title = req.body.title;

        if (!title || !description){
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        var mailTo = TRA.EMAIL_COMPLAIN_ENQUIRIES;
        var userId = (req.session && req.session.uId) ? new ObjectId(req.session.uId) : null;
        var templateName = 'public/templates/mail/suggestion.html';
        var from = 'testTRA  <' + TRA.EMAIL_COMPLAIN_FROM + '>';
        var attachment = req.body.attachment;

        var mailOptions = {
            templateData: {
                title: title,
                description: description,
                userId: userId
            },
            templateName: templateName,
            from: from,
            mailTo: mailTo,
            title: title,
            attachment: attachment
        };

        mailer.sendReport(mailOptions, function (errMail, data) {

            //TODO remove console.logs

            var emailReport = new EmailReport({
                attachment: attachment,
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
        var errors = [];

        validation.checkRate15(errors, true, signalLevel, 'Signal level');
        if (errors.length) {
            return res.status(400).send({error: errors});
        }

        var location = req.body.location;
        var address = req.body.address;
        var title = (location && location.latitude)
            ? ('Location.latitude: ' + location.latitude + ', location.longitude: ' + location.longitude + ' Signal level: ' + signalLevel)
            : address + ' Signal level: ' + signalLevel;
        var mailTo = TRA.EMAIL_COMPLAIN_POOR_COVERAGE;
        var userId = (req.session && req.session.uId) ? new ObjectId(req.session.uId) : null;
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

        var mailOptions = {
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