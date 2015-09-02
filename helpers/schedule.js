var schedule = function (db) {
    'use strict';

    var schedule = require('node-schedule');
    var mongoose = require('mongoose');
    var CONST = require('../constants');

    var ObjectId = mongoose.Types.ObjectId;
    var SCHEDULE_JOB;
    var rule = new schedule.RecurrenceRule();
    var currentDate = new Date();
    var oneYearOldDate = new Date();
    //rule.dayOfWeek = [ new schedule.Range(0, 6)];
    //console.log('rule: ',rule);
    rule.minute = 30;

    oneYearOldDate.setYear(currentDate.getFullYear() - 1);
    console.log('Schedule helper started');

    SCHEDULE_JOB = schedule.scheduleJob(rule, function () {
        console.log('Schedule job started at: ', new Date());
        CheckOldRecordsFeedbackCollection();
        CheckOldRecordsEmailReportsCollection()

    });

    function CheckOldRecordsFeedbackCollection() {
        var Feedback = db.model(CONST.MODELS.FEEDBACK);

        console.log('Check OLD record in Feedback Collection: ', oneYearOldDate);

        Feedback
            .find({'createdAt': { $lt: oneYearOldDate } })
            //TODO uncomment this for real remove from DB
            //.remove()
            .exec(function (err, collection) {
                if (err) {
                    console.log(err);
                }
                console.log('Remove from Feedback: ',collection);
            });
    }

    function CheckOldRecordsEmailReportsCollection() {
        var EmailReport = db.model(CONST.MODELS.EMAIL_REPORT);

        console.log('Check OLD record in EmailReports Collection: ', oneYearOldDate);

        EmailReport
            .find({'createdAt': { $lt: oneYearOldDate } })
            //TODO uncomment this for real remove from DB
            //.remove()
            .exec(function (err, collection) {
                if (err) {
                    console.log (err);
                }
                console.log('Remove from EmailReports: ',collection);
            });
    }
};

module.exports = schedule;