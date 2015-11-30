var CONST = require('../constants');
var RESPONSE = require('../constants/response');
var SCHEDULE_JOB;

//var RSS_FEED_URL = 'http://www.forbes.com/technology/index.xml';
var RSS_FEED_URL_EN = 'https://www.tra.gov.ae/handlers/public/tra/rss.aspx?lang=1';
var RSS_FEED_URL_AR = 'https://www.tra.gov.ae/handlers/public/tra/rss.aspx?lang=2';
var MAX_NEWS_COUNT = 200;

var REGULAR_EXPRESSION_ITEM = '<item>\n*([^]+?)<\/item>';
var REGULAR_EXPRESSION_LINK = '<link>([^]+?)<\/link>';
var REGULAR_EXPRESSION_TITLE = '<title>([^]+?)<\/title>';
var REGULAR_EXPRESSION_DESCRIPTION = '<description>([^]+?)<\/description>';
var REGULAR_EXPRESSION_PUB_DATE = '<pubDate>([^]+?)<\/pubDate>';
var REGULAR_EXPRESSION_MEDIA_CONTENT = '<media:content url="([^]+?)"';

var LANG = {
    EN: 'EN',
    AR: 'AR'
};

var HtmlChars = {
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

        var regexp = new RegExp(REGULAR_EXPRESSION_ITEM,'gm');
        var regexpLink = new RegExp(REGULAR_EXPRESSION_LINK,'m');
        var regexpTitle = new RegExp(REGULAR_EXPRESSION_TITLE,'m');
        var regexpDescription = new RegExp(REGULAR_EXPRESSION_DESCRIPTION,'m');
        var regexpPubDate = new RegExp(REGULAR_EXPRESSION_PUB_DATE,'m');
        var regexpMediaContent = new RegExp(REGULAR_EXPRESSION_MEDIA_CONTENT,'m');

        var parsedXml = [];
        var parsedXmlObject = [];

        while (parsedXml = regexp.exec(xmlBody)) {

            parsedXmlObject.push({
                link: regexpLink.exec(parsedXml)[1],
                title: regexpTitle.exec(parsedXml)[1],
                description: trimHtmlTags(regexpDescription.exec(parsedXml)[1]),
                pubDate: new Date(Date.parse(regexpPubDate.exec(parsedXml)[1])),
                image: (regexpMediaContent.exec(parsedXml)) ? regexpMediaContent.exec(parsedXml)[1] : null,
                lang: lang
            });
        }
        return parsedXmlObject;
    }

    function trimHtmlTags(text) {

        text = text.replace('&lt;![CDATA[', '');
        text = text.replace(']]&gt;', '');

        text = text.replace(/&lt;/gm, '<');
        text = text.replace(/&gt;/gm, '>');
        text = text.replace(/<([^>]+?)>/gm, '');

        text = replaceHtmlChars(text);

        return text;
    }

    function replaceHtmlChars(text) {
        for (var prop in HtmlChars) {
            text = text.replace(new RegExp(prop, 'gm'), HtmlChars[prop]);
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
                        if(collection.length > 0) {
                            console.log('Remove News elder then: ' + collection[0].get('pubDate'));
                            Announcement
                                .remove({ pubDate: { $lte: collection[0].get('pubDate')}}, function(err, result) {
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