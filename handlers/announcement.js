var CONST = require('../constants');
var RESPONSE = require('../constants/response');
var SCHEDULE_JOB;

//var RSS_FEED_URL = 'http://www.forbes.com/technology/index.xml';
var RSS_FEED_URL_EN = 'https://www.tra.gov.ae/handlers/public/tra/rss.aspx?lang=1';
var RSS_FEED_URL_AR = 'https://www.tra.gov.ae/handlers/public/tra/rss.aspx?lang=2';
var MAX_NEWS_COUNT = 20;

var REGEXP_ITEM = new RegExp('<item>\n*([^]+?)<\/item>','gm');
var REGEXP_LINK = new RegExp('<link>([^]+?)<\/link>','m');
var REGEXP_TITLE = new RegExp('<title>([^]+?)<\/title>','m');
var REGEXP_DESCRIPTION = new RegExp('<description>([^]+?)<\/description>','m');
var REGEXP_PUB_DATE = new RegExp('<pubDate>([^]+?)<\/pubDate>','m');
var REGEXP_MEDIA_CONTENT = new RegExp('<media:content url="([^]+?)"','m');

var REGEXP_LEFT_GR = /&lt;/gm;
var REGEXP_RIGHT_GR = /&gt;/gm;
var REGEXP_HTML_TAGS = /<([^>]+?)>/gm;

var LANG = {
    EN: 'EN',
    AR: 'AR'
};

var HTML_CHARS = {
    '&amp;': '&',
    '&nbsp;': ' ',
    '&cent;': '¢',
    '&pound;': '£',
    '&yen;': '¥',
    '&euro;': '€',
    '&copy;': '©',
    '&reg;': '®',
    '&ldquo;': '“',
    '&rdquo;': '”',
    '&lsquo;': '‘',
    '&rsquo;': '’',
    '&laquo;': '«',
    '&raquo;': '»',
    '&lsaquo;': '‹',
    '&rsaquo;': '›'
};

var AnnouncementHandler = function(db) {
    'use strict';

    var schedule = require('node-schedule');
    var request = require('request');

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
        request(RSS_FEED_URL_EN, {json: true}, function (err, res, body) {

            if (err) {
                console.log('Get News error: ' + err);
                return;
            }

            var newsItems = parserXml(body, LANG.EN);

            for (var i = 0; i < newsItems.length; i++) {
                findOrCreateAnnouncement(newsItems[i], function (err) {
                    if (err) {
                        if (!isDuplicateIndexError(err)) {
                            console.log('Error on create announcement: ' + err);
                        }
                    }
                });
            }

            removeOldNews();
        });

        request(RSS_FEED_URL_AR, {json: true}, function (err, res, body) {

            if (err) {
                console.log('Get News error: ' + err);
                return;
            }

            var newsItems = parserXml(body, LANG.AR);

            for (var i = 0; i < newsItems.length; i++) {
                findOrCreateAnnouncement(newsItems[i], function (err) {
                    if (err) {
                        if (!isDuplicateIndexError(err)) {
                            console.log('Error on create announcement: ' + err);
                        }
                    }
                });
            }

            removeOldNews();
        });
    }

    function parserXml(xmlBody, lang) {

        var parsedXml;
        var parsedXmlObject = [];

        while (parsedXml = REGEXP_ITEM.exec(xmlBody)) {

            parsedXmlObject.push({
                link: REGEXP_LINK.exec(parsedXml)[1],
                title: REGEXP_TITLE.exec(parsedXml)[1],
                description: trimHtmlTags(REGEXP_DESCRIPTION.exec(parsedXml)[1]),
                pubDate: new Date(Date.parse(REGEXP_PUB_DATE.exec(parsedXml)[1])),
                image: (REGEXP_MEDIA_CONTENT.exec(parsedXml)) ? REGEXP_MEDIA_CONTENT.exec(parsedXml)[1] : null,
                lang: lang
            });
        }
        return parsedXmlObject;
    }

    function trimHtmlTags(text) {

        text = text.replace('&lt;![CDATA[', '');
        text = text.replace(']]&gt;', '');

        text = text.replace(REGEXP_LEFT_GR, '<');
        text = text.replace(REGEXP_RIGHT_GR, '>');
        text = text.replace(REGEXP_HTML_TAGS, '');

        text = replaceHtmlChars(text);

        return text;
    }

    function replaceHtmlChars(text) {
        for (var prop in HTML_CHARS) {
            text = text.replace(new RegExp(prop, 'gm'), HTML_CHARS[prop]);
        }
        return text;
    }

    function isDuplicateIndexError(err) {
        return (err instanceof Error && err.code == 11000);
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

        if (typeof newsItem.description !== 'string') {
            console.dir(newsItem.description);
            newsItem.description = newsItem.title;
        }

        var announcement = new Announcement(newsItem);

        announcement
            .save(function (err, ann) {
                callback(err, ann);
            });
    }

    function removeOldNews() {
        Announcement.count({}, function (err, count) {

            if (count && count > MAX_NEWS_COUNT) {

                var sortOrder = {pubDate: -1};
                var skipCount = MAX_NEWS_COUNT;
                var limitCount = count - MAX_NEWS_COUNT;

                Announcement
                    .find({})
                    .sort(sortOrder)
                    .skip(skipCount)
                    .limit(limitCount)
                    .exec(function (err, collection) {
                        if (err) {
                            return console.log('find old news error: ' + err);
                        }
                        if (collection.length > 0) {
                            var oldPubDate = collection[0].get('pubDate');
                            console.log('Remove News elder then: ' + oldPubDate);
                            Announcement
                                .remove({pubDate: {$lte: oldPubDate}}, function (err, result) {
                                    if (err) {
                                        console.log('Error on model remove: ' + err);
                                    }
                                })
                        }
                    })
            }
        })
    }

    this.getAllAnnouncements = function (req, res, next) {

        var sortField = 'pubDate';
        var sortDirection = -1;
        var sortOrder = {};
        sortOrder[sortField] = sortDirection;

        var skipCount = req.query.offset || 0;
        var limitCount = req.query.limit || 20;
        var lang = req.query.lang ? req.query.lang.toUpperCase() : LANG.EN;

        if (!(lang === 'EN' || lang === 'AR')) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS + ' language: AR or EN'});
        }

        var findParams = {};

        var search = req.query.search ? req.query.search : null;

        if (search) {
            findParams = {
                $and: [
                    {lang: lang},
                    {
                        $or: [
                            {title: new RegExp(search, 'i')},
                            {description: new RegExp(search, 'i')}
                        ]
                    }
                ]
            };
        } else {
            findParams = {
                lang: lang
            }
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