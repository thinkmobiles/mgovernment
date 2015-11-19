/**
 * Provides ability for getting Innovations, information about Innovation, edit and delete Innovation
 *
 * @class userInnovation
 *
 */
var express = require('express');
var router = express.Router();

var UserInnovation = require('../handlers/userInnovation');
var SessionHandler = require('../handlers/sessions');

module.exports = function(db) {
    'use strict';

    var userInnovation = new UserInnovation(db);
    var session = new SessionHandler(db);

    /**
     *  This __method__ create a new Innovation
     *
     *  __URI:__ ___`/innovation`___
     *
     *  __Method:__ ___`POST`___
     *
     *  ## Request
     *     Body:
     *      title:
     *      message:
     *      type:
     *      user:
     *
     *  ## Response
     *     Status(201) JSON Object {object}
     *     Status(400, 403, 500) JSON object: {error: 'Text about error'} or  {error: object}
     *
     *  @example
     *      {   _id: '5645a4ab8219070c0edac298',
     *          title: 'test',
     *          message: 'some message',
     *          createdAt: '2015-11-13T08:51:55.461Z',
     *          user: null
     *      }
     *
     *  @method createInnovation
     *  @for userInnovation
     *  @memberOf userInnovation
     *
     */
    router.route('/')
        .post(session.isAuthenticatedUser, userInnovation.createInnovation)

    /**
     *  This __method__ get information about all Innovations
     *
     *  __URI:__ ___`/innovation`___
     *
     *  __Method:__ ___`GET`___
     *
     *  ## Request
     *     Query: offset, limit, orderBy, order
     *     Example: /innovation?offset=0&limit=10&orderBy=createdAt
     *
     *  ## Response
     *     Status(200) JSON Object {[Object]}
     *     Status(400, 403, 500) JSON Object {error: 'Text about error'} or  {error: object}
     *
     *  @example
     *      [ { _id: '56420ff564b32f5411d246ec',
     *          title: 'edit',
     *          message: 'edit Innovation',
     *          type: '3',
     *          createdAt: '2015-11-10T15:40:37.108Z',
     *          user: null },
     *        { _id: '56431580f3980f901227b832',
     *          title: 'test',
     *          message: 'some message',
     *          type: '1',
     *          createdAt: '2015-11-11T10:16:32.217Z',
     *          user: '5645bc919bd13a000e619ded' } ]
     *
     *  @method getAllInnovations
     *  @for userInnovation
     *  @memberOf userInnovation
     *
     */
        .get(session.isAuthenticatedUser, userInnovation.getAllInnovations);

    return router;
};