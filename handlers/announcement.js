var CONST = require('../constants');
var RESPONSE = require('../constants/response');
var SCHEDULE_JOB;
var RSS_FEED_URL = 'http://www.forbes.com/technology/index.xml';

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
        request(RSS_FEED_URL, {json: true}, function (err, res, body) {

            if (err) {
                console.log('Get News error: ' + err);
                return;
            }

            var jsonData = xmlParser.toJson(body, {
                sanitize: true,
                object: true
            });

            try {
                var newsItems = jsonData.rss.channel.item;
            }
            catch (err) {
                console.log('Error on parse news (' + new Date() + '): ' + err);
                return;
            }

            for (var i = 0; i < newsItems.length; i++) {
                findOrCreateAnnouncement(newsItems[i], function (err) {
                    if (err) {
                        console.log('Error on create announcement: ' + err);
                    }
                });
            }
        });
    }

    function findOrCreateAnnouncement(newsItem, callback) {
        Announcement
            .findOne({pubDate: newsItem.pubDate, title: newsItem.title})
            .exec(function (err, announ) {

                if (err || !announ) {
                    return createAnnouncement(newsItem, callback);
                } else {
                    return callback();
                }
            })
    }

    function createAnnouncement(newsItem, callback) {

        var pubDate = new Date(Date.parse(newsItem.pubDate));

        var imageLink = null;
        if (newsItem['media:content']) {
            imageLink = newsItem['media:content'].url;
        }

        var announcement = new Announcement({
            title: newsItem.title,
            description: newsItem.description,
            pubDate: pubDate,
            link: newsItem.link,
            image: imageLink
        });

        announcement
            .save(function (err, ann) {
                callback(err, ann);
            });
    }

    this.getAllAnnouncements = function (req, res, next) {

        var sortField = 'pubDate';
        var sortDirection = -1;
        var sortOrder = {};
        sortOrder[sortField] = sortDirection;

        var skipCount = req.query.offset || 0;
        var limitCount = req.query.limit || 20;

        var findParams = {};

        var search = req.query.search ? req.query.search : null;
        if (search) {
            findParams = {
                $or: [
                    {title: new RegExp(search, 'i')},
                    {description: new RegExp(search, 'i')}
                ]
            };
        }

        Announcement
            .find(findParams, {__v: false})
            .sort(sortOrder)
            .skip(skipCount)
            .limit(limitCount)
            .exec(function (err, collection) {
                if (err) {
                    return next(err);
                }

                return res.status(200).send({announcements: collection});
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