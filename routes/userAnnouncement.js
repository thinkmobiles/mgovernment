/**
 * Provides ability for getting Announcements, information about announcement
 *
 * @class userAnnouncement
 *
 */
var express = require('express');
var router = express.Router();

var UserAnnouncement = require('../handlers/announcement');
var SessionHandler = require('../handlers/sessions');

module.exports = function(db) {
    'use strict';

    var userAnnouncement = new UserAnnouncement(db);
    var session = new SessionHandler(db);

    /**
     * This __method__ get information about all announcements or searched current announcement, also get
     *
     * __URI:__ ___`/announcement`___
     *
     * __Method:__ ___`GET`___
     *
     *  ## Request
     *     Query:  offset, limit, search
     *     Example: /announcement?offset=5&limit=10
     *     Example: /announcement?offset=5&limit=10&lang=AR
     *     Example: /announcement?offset=0&limit=10&search=season
     *
     *  ## Response
     *     Status(200) JSON Object {[object]}
     *     Status(400, 403, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     *
     * @example
     *  { announcements:
     *    [ {   _id: '56447f728aa2fb241651d717',
     *          link: 'http://www.forbes.com/sites/oracle/2015/11/12/5-best-practices-in-application-user-experience/',
     *          title: '5 Best Practices In Application User Experience',
     *          description: 'Follow these five design best practices to ensure a stellar application user experience.',
     *          createdAt: '2015-11-12T12:00:50.470Z',
     *          pubDate: '2015-11-12T11:15:00.000Z',
     *          image: 'http://blogs-images.forbes.com/oracle/files/2015/10/mobile_2.jpg' },
     *
     *      {   _id: '56447f728aa2fb241651d718',
     *          link: 'http://www.forbes.com/sites/jamesconca/2015/11/12/white-house-summit-opens-annual-nuclear-meeting/',
     *          title: 'White House Summit Opens Annual Nuclear Meeting',
     *          description: 'The American Nuclear Society just wrapped up its annual meeting today in Washington, D.C. Since the theme was how nuclear can address climate change, it was exciting that the meeting was kicked-off with a Nuclear Summit at the White House on Friday that highlighted just that issue. To Obama Administration sees nuclear as needing to be at least 20% of our energy mix going into the future and hopes the Clean Power Plan can help.',
     *          createdAt: '2015-11-12T12:00:50.494Z',
     *          pubDate: '2015-11-12T11:00:00.000Z',
     *          image: 'http://blogs-images.forbes.com/jamesconca/files/2015/11/Figure-1.jpg' }
     *    ] }
     *
     *  @method getAllAnnouncements
     *  @for userAnnouncement
     *  @memberOf userAnnouncement
     */
    router.route('/')
        .get(userAnnouncement.getAllAnnouncements);

    /**
     * This __method__ get information about count of all announcements
     *
     * __URI:__ ___`/announcement/count`___
     *
     * __Method:__ ___`GET`___
     *
     *  ## Request
     *     Example: /announcement/count
     *
     *  ## Response
     *     Status(200)JSON Object {object}
     *     Status(403, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     * @example
     *      {  count: 10  }
     *
     * @method getCount
     * @for userAnnouncement
     * @memberOf userAnnouncement
     */
    router.route('/count')
        .get(session.isAuthenticatedUser, userAnnouncement.getCount);

    return router;
};