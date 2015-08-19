
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
        .get(session.isAdminBySession, users.getCount);

    router.post('/signIn', users.signInClient);
    router.post('/register', users.registerClient);

    router.route('/adminSignIn')
        .get(session.isAdminBySession, function(req, res, next){
                res.status(200).send({success: 'This is admins session'});
            })
        .post(users.adminSignIn);

    router.post('/signOut', users.signOutClient);

    router.get('/profile', session.authenticatedUser,  users.getUserProfileBySession);


    router.route('/account/:serviceId')
        .get(session.authenticatedUser, users.getServicesAccountById);

    router.route('/account')
      //  .get(session.authenticatedUser, users.getServicesAccounts)
        .post(session.authenticatedUser, users.createServicesAccount)
        .put(session.authenticatedUser, users.updateServicesAccount);

    router.route('/favorites/')
        .post(session.authenticatedUser, users.addServiceToFavorites)
        .get(session.authenticatedUser, users.getServicesFromFavorites)
        .delete(session.authenticatedUser, users.deleteServiceToFavorites);

    router.route('/account/image')
        .post(imageHandler.uploadImageReq);

    router.route('/account/image/:id')
        .get(imageHandler.getImage)
        .delete(imageHandler.removeImage);

    router.route('/:id')
        .get(session.isAdminBySession, users.getUserProfileByIdForAdmin)
        .put(session.isAdminBySession,users.updateAccount)
        .delete(session.isAdminBySession, users.deleteUserProfileByIdForAdmin);

    return router;
};
