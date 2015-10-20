var CONST = require('../constants');
var RESPONSE = require('../constants/response');
var SCHEDULE_JOB;

var AnnouncementHandler = function(db) {
    'use strict';

    var schedule = require('node-schedule');
    var request = require('request');
    var xmlParser = require('xml2json');

    var mongoose = require('mongoose');
    var ObjectId = mongoose.Types.ObjectId;
    var Announcement = db.model(CONST.MODELS.ANNOUNCEMENT);

    startUpdateNews();

    function startUpdateNews() {

        if (!SCHEDULE_JOB) {

            UpdateNews();

            var rule = new schedule.RecurrenceRule();
            rule.minute = 5;

            SCHEDULE_JOB = schedule.scheduleJob(rule, function () {
                console.log('Schedule for Update News started at: ', new Date());

                UpdateNews();
            });
        }
    }

    function UpdateNews() {
        request('http://feeds.reuters.com/Reuters/worldNews', {
            json: true
        }, function (err, res, body) {
            if (err) {
                console.log('Get News error: ' + err);
            } else {

                var jsonData = xmlParser.toJson(body, {
                    sanitize: true,
                    object: true
                });

                try {
                    var newsItems = jsonData.rss.channel.item;
                }
                catch (err) {
                    console.log('Error on parse news (' + new Date() + '): ' + err);
                }

                for (var i = 0; i < newsItems.length; i++) {
                    findOrCreateAnnouncement(newsItems[i]);
                }

                console.dir(jsonData);
            }
        });
    }

    function findOrCreateAnnouncement(newsItem) {
        Announcement
            .findOne({pubDate: newsItem.pubDate, title: newsItem.title})
            .exec(function (err, announ) {

                if (err || !announ) {

                    var announcement = new Announcement({
                        title: newsItem.title,
                        description: newsItem.description,
                        pubDate: newsItem.pubDate,
                        link: newsItem.link
                    });

                    announcement
                        .save(function (err, ann) {

                        });

                } else {
                    if (announ) {
                        console.log('news in db');
                    }
                }
            })
    }

    this.getAllAnnouncements = function (req, res, next) {

        var sortField = 'pubDate';
        var sortDirection = +req.query.order || 1;
        var sortOrder = {};
        sortOrder[sortField] = sortDirection;

        var skipCount = req.query.offset || 0;
        var limitCount = req.query.limit || 20;

        Announcement
            .find({})
            .sort(sortOrder)
            .skip(skipCount)
            .limit(limitCount)
            .exec(function (err, collection) {
                if (err) {
                    return next(err);
                }

                return res.status(200).send(collection);
            });
    };

    this.getCount = function (req, res, next) {

        Announcement
            .count({}, function (err, count) {
                if (err) {
                    return next(err);
                }
                return res.status(200).send({count: count});
            });
    };

};

module.exports = AnnouncementHandler;