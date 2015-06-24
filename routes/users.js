var express = require( 'express' );
var router = express.Router();
var UserHandler = require('../handlers/users');

var SessionHandler = require('../handlers/sessions');

module.exports = function(db){

    var users = new UserHandler(db);
    var session = new SessionHandler(db);


    router.post('/signIn', users.signInClient );
    router.post('/create', users.createAccount);
    router.post('/signOut', users.signOutClient);
    router.get('/profile', session.authenticatedUser,  users.getUserProfileBySession);
    router.get('/profile/:id', users.isAdminBySession,  users.getUserProfileByIdForAdmin);
    router.post('/account', session.authenticatedUser, users.createServicesAccount);
    router.put('/account', session.authenticatedUser, users.updateServicesAccount);


    return router;
};
