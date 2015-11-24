/**
 * Provides ability for:
 *  -   CRUD Users Account,
 *  -   USer: Register/ SignIn /SignOut,
 *  -   CRUD Users Favorites Services
 *  -   CRUD Uers Services accounts
 *
 * @class users
 *
 */

var express = require( 'express' );
var router = express.Router();
var UserHandler = require('../handlers/users');
var ImageHandler = require('../handlers/images');
var SessionHandler = require('../handlers/sessions');

module.exports = function(db){
    'use strict';

    var users = new UserHandler(db);
    var session = new SessionHandler(db);
    var imageHandler = new ImageHandler(db);

       /*router.route('/')
        .post(session.isAdminBySession,users.createAccount)
        .get(session.isAdminBySession,users.getUserProfiles);*/

    /*router.route('/getCount/')
        .get(session.isAdminBySession, users.getCount);*/

    router.post('/signIn', users.signInClient);
    router.post('/register', users.registerClient);

    router.route('/adminSignIn')
        .get(session.isAdminBySession, function(req, res, next){
                res.status(200).send({success: 'This is admins session'});
            })
        .post(users.adminSignIn);

    router.post('/signOut', users.signOutClient);

    router.get('/profile', session.isAuthenticatedUser,  users.getUserProfileBySession);


    router.route('/account/:serviceId')
        .get(session.isAuthenticatedUser, users.getServicesAccountById);

    router.route('/account')
      //  .get(session.isAuthenticatedUser, users.getServicesAccounts)
        .post(session.isAuthenticatedUser, users.createServicesAccount)
        .put(session.isAuthenticatedUser, users.updateServicesAccount);

    router.route('/favorites/')
        .post(session.isAuthenticatedUser, users.addServiceToFavorites)
        .get(session.isAuthenticatedUser, users.getServicesFromFavorites)
        .delete(session.isAuthenticatedUser, users.deleteServiceToFavorites);

    router.route('/account/image')
        .post(imageHandler.uploadImageReq);

    router.route('/account/image/:id')
        .get(imageHandler.getImage)
        .delete(imageHandler.removeImage);

    /*router.route('/:id')
        .get(session.isAdminBySession, users.getUserProfileByIdForAdmin)
        .put(session.isAdminBySession,users.updateAccount)
        .delete(session.isAdminBySession, users.deleteUserProfileByIdForAdmin);*/

    return router;
};
