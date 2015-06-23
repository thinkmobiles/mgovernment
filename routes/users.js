var express = require( 'express' );
var router = express.Router();
var UserHandler = require('../handlers/users');

var SessionHandler = require('../handlers/sessions');
var profileHandler = require('../handlers/profiles');

module.exports = function(db){

    var users = new UserHandler(db);
    var session = new SessionHandler(db);
    var profiles = new profileHandler(db);

    router.post('/signIn', users.signInClient );
    router.post('/create', users.createAccount);
    router.post('/signOut', users.signOutClient);
    router.get('/profile', session.authenticatedUser,  profiles.getProfileBySession);
    router.get('/profile/:id', users.isAdminBySession,  profiles.getProfileByIdForAdmin);

    return router;
};
