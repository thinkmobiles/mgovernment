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

    /**
     *  This __method__ create a new Innovation by Admin
     *
     *  __URI:__ ___`/innovation/admin`___
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
     *     Status(200) JSON Object {Object}
     *     Status(400, 403, 500) JSON Object {error: 'Text about error'} or {error: Object}
     *
     *  @example
     *      {   _id: '5645bc919bd13a000e619df1',
     *          title: 'test',
     *          message: 'some message',
     *          type: '1',
     *          createdAt: '2015-11-13T10:33:53.404Z'
     *          user: '5645bc919bd13a000e619ded' }
     *
     *  @method createInnovation
     *  @for userInnovation
     *  @memberOf userInnovation
     */
    router.route('/admin')
        .post(session.isAdminBySession, userInnovation.createInnovation);

    /**
     * This __method__ edit Innovation by Admin
     *
     *  __URI:__ ___`/innovation/admin`___
     *
     *  __Method:__ ___`PUT`___
     *
     *  ## Request
     *     Body:
     *      title:
     *      message:
     *      type:
     *     Params: id
     *     Example: /innovation/admin/56420ff564b32f5411d246ec
     *
     *  ## Response
     *     Status(200) JSON Object {Object}
     *     Status(400, 403, 500) JSON Object {error: 'Text about error'} or {error: Object}
     *
     *  @example
     *      {   _id: '5645bc919bd13a000e619df1',
     *          title: 'edit',
     *          message: 'edit innovation',
     *          type: '3',
     *          createdAt: '2015-11-13T10:33:53.404Z'
     *          user: '5645bc919bd13a000e619ded' }
     *
     *  @method editInnovationById
     *  @for userInnovation
     *  @memberOf userInnovation
     *
     */
    router.route('/admin/:id')
        .put(session.isAdminBySession, userInnovation.editInnovationsById)

    /**
     * This __method__ get information about Innovation by Admin
     *
     *  __URI:__ ___`/innovation/admin/:id`___
     *
     *  __Method:__ ___`GET`___
     *
     *  ## Request
     *     Params: id
     *     Example: /innovation/admin/5645bc919bd13a000e619df1
     *
     *  ## Response
     *     Status(200) JSON Object {Object}
     *     Status(400, 403, 404, 500) JSON Object {error: 'Text about error'} or {error: Object}
     *
     *  @example
     *      {   _id: '5645bc919bd13a000e619df1',
     *          title: 'test',
     *          message: 'some message',
     *          type: '1',
     *          createdAt: '2015-11-13T10:33:53.404Z'
     *          user: '5645bc919bd13a000e619ded' }
     *
     *  @method getInnovationById
     *  @for userInnovation
     *  @memberOf userInnovation
     *
     */
        .get(session.isAdminBySession, userInnovation.getInnovationsById)

    /**
     * This __method__ delete Innovation by Admin
     *
     *  __URI:__ ___`/innovation/admin`___
     *
     *  __Method:__ ___`DELETE`___
     *
     *  ## Request
     *     Params: id
     *     Example: /innovation/admin/5645bc919bd13a000e619df1
     *
     *  ## Response
     *     Status(200) JSON Object {Object}
     *     Status(400, 403, 500) JSON Object {error: 'Text about error'} or {error: Object}
     *
     *  @example
     *      { success: 'Success' }
     *
     *  @method deleteInnovationById
     *  @for userInnovation
     *  @memberOf userInnovation
     *
     */
        .delete(session.isAdminBySession, userInnovation.deleteInnovationsById);

    return router;
};