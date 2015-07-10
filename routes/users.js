
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

    router.route('/')
        .post(session.isAdminBySession,users.createAccount)
        .get(session.isAdminBySession,users.getUserProfiles);

    router.route('/getCount/')
        .get(users.getCount);

    router.post('/signIn', users.signInClient );
    router.post('/signOut', users.signOutClient);

    router.get('/profile', session.authenticatedUser,  users.getUserProfileBySession);
    router.route('/profile/:id')
        .get(session.isAdminBySession, users.getUserProfileByIdForAdmin)
        .delete(session.isAdminBySession, users.deleteUserProfileByIdForAdmin);

    router.route('/account/:serviceId')
        .get(session.authenticatedUser, users.getServicesAccountById);

    router.route('/account')
      //  .get(session.authenticatedUser, users.getServicesAccounts)
        .post(session.authenticatedUser, users.createServicesAccount)
        .put(session.authenticatedUser, users.updateServicesAccount);

    router.route('/account/image')
        .post(imageHandler.uploadImageReq);

    router.route('/account/image/:id')
        .get(imageHandler.getImage)
        .delete(imageHandler.removeImage);

    return router;
};
