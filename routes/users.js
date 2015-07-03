
var express = require( 'express' );
var router = express.Router();
var UserHandler = require('../handlers/users');

var SessionHandler = require('../handlers/sessions');

module.exports = function(db){

    var users = new UserHandler(db);
    var session = new SessionHandler(db);

    router.route('/')
        .post(session.isAdminBySession,users.createAccount)
        .get(session.isAdminBySession,users.getUserProfiles);

    router.route('/getCount/')
        .get(users.getCount);

    router.post('/signIn', users.signInClient );
    router.post('/signOut', users.signOutClient);
    router.get('/profile', session.authenticatedUser,  users.getUserProfileBySession);
    router.route('/profile/:id')
        .get(session.isAdminBySession,  users.getUserProfileByIdForAdmin)
        .delete(session.isAdminBySession,  users.deleteUserProfileByIdForAdmin);

    router.route('/account')
        .post(session.authenticatedUser, users.createServicesAccount)
        .put(session.authenticatedUser, users.updateServicesAccount);

    return router;
};
