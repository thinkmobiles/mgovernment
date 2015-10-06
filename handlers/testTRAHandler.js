var CONST = require('../constants');
var RESPONSE = require('../constants/response');
var TRA = require('../constants/traServices');

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

    //TODO remove
    /* little script to get data about services from TRA site
    findData();
    findData('ar');

    function findData(lang) {
        var request = require('request');
        var j = request.jar();
        var request = request.defaults({jar:j});

        if(!lang) {
            lang = 'en';
        }

        request('http://www.tra.gov.ae/' + lang + '/?r=1', function (error, response, body) {
            request('http://www.tra.gov.ae/services/individuals.html', function (error, response, body) {
                if (!error && response.statusCode == 200) {

                    var reg = /<a href="(.+)" class="list-group-item">(.+)?<\/a>/g;

                    var results = {};
                    var count = 0;

                    body.replace(reg, function (allreg, hrefGroup, nameGroup) {

                        var servName = nameGroup.trim();
                        results[servName] = {
                            url: hrefGroup,
                            name: servName
                        };
                        count++;
                        return '';
                    });

                    for (var elemName in results) {
                        (function () {
                            var elem = results[elemName];
                            var url = elem.url;
                            var name = elem.name;

                            request(url, function (error, response, bodyService) {
                                if (!error && response.statusCode == 200) {

                                    var regPanel = /<div class="panel-body"(.|\n)+?<h2 style=".+?">(.+)?<\/h2>((.|\n)*?)<\/div>/gm;

                                    bodyService.replace(regPanel, function (allreg, some, nameGroup, infoGroup) {
                                        results[name][nameGroup.trim()] = infoGroup.trim();
                                        return '';
                                    });
                                }

                                count--;
                                if (count <= 0) {
                                    console.dir(results);

                                    var fs = require('fs');

                                    var str = JSON.stringify(results, null, '\t\r\n');

                                    fs.writeFile('servicesInfo_' + lang + '.txt', str, function (err) {
                                        if (err) {
                                            console.log('err on save: ' + err);
                                        }
                                        console.log('It\'s saved!');
                                    });
                                }
                            });
                        })();
                    }

                }
            })
        })
    }
*/

    /*
    //findNews();

    function findNews(lang) {
        var request = require('request');
        var j = request.jar();
        var request = request.defaults({jar: j});

        if (!lang) {
            lang = 'en';
        }

        request('http://www.tra.gov.ae/' + lang + '/?r=1', function (error, response, body) {
            request('http://www.tra.gov.ae/press-releases.html', function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    // ajax - http://www.tra.gov.ae/ajax/ajax_news_categories.php

                    var reg = /<a href="(.+)" class="list-group-item serviceicon">(.+)?<\/a>/g;

                    var results = {};
                    var count = 0;

                    body.replace(reg, function (allreg, hrefGroup, monthNameGroup) {

                        var servName = monthNameGroup.trim();
                        results[servName] = {
                            url: hrefGroup,
                            name: servName
                        };
                        count++;
                        return '';
                    });

                    for (var elemName in results) {
                        (function () {
                            var elem = results[elemName];
                            var url = elem.url;
                            var name = elem.name;

                            request(url, function (error, response, bodyService) {
                                if (!error && response.statusCode == 200) {

                                    var regPanel = /<div class="media"(.|\n)+?<h2 style=".+?">(.+)?<\/h2>((.|\n)*?)<\/div>/gm;

                                    bodyService.replace(regPanel, function (allreg, some, nameGroup, infoGroup) {
                                        results[name][nameGroup.trim()] = infoGroup.trim();
                                        return '';
                                    });
                                }

                                count--;
                                if (count <= 0) {
                                    console.dir(results);

                                    var fs = require('fs');

                                    var str = JSON.stringify(results, null, '\t\r\n');

                                    fs.writeFile('servicesInfo_' + lang + '.txt', str, function (err) {
                                        if (err) {
                                            console.log('err on save: ' + err);
                                        }
                                        console.log('It\'s saved!');
                                    });
                                }
                            });
                        })();
                    }
                }
            })
        })
    }
*/

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
        var from = 'TRA  <' + TRA.EMAIL_COMPLAIN_FROM + '>';

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
        var title = (location && location.latitude && location.longitude)
            ? ('Location.latitude: ' + location.latitude + ', location.longitude: ' + location.longitude + ' Signal level: ' + signalLevel)
            :  "Address: " + address + ' Signal level: ' + signalLevel;
        var mailTo = TRA.EMAIL_COMPLAIN_POOR_COVERAGE;
        var userId = null; //(req.session && req.session.uId) ? new ObjectId(req.session.uId) : null;
        var templateName = 'public/templates/mail/poorCoverage.html';
        var from = 'TRA  <' + TRA.EMAIL_COMPLAIN_FROM + '>';

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
        var from = 'TRA  <' + TRA.EMAIL_COMPLAIN_FROM + '>';

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