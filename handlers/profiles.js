var CONST = require('../constants');

var ProfileHandlers = function(db) {
    var mongoose = require('mongoose');
    var Profile = db.model('profile');
    var ObjectId = mongoose.Types.ObjectId;

    this.getProfileBySession = function ( req, res, next ) {

        var userId = req.session.uId;
        getProfileById(userId, function (err, profile) {
            if (err) {
                return next(err);
            }
            return res.status(200).send(profile);
        });
    };



    this.getProfileByIdForAdmin = function ( req, res, next ) {

        var userId = req.params.id;
        console.log ('userId: ',userId);

        getProfileById(userId, function (err, profile) {
            if (err) {
                return next(err);
            }
            return res.status(200).send(profile);
        });
    };


    function getProfileById (userId, callback){
        console.log('Profiles Handlers started');

        Profile
            .findOne({owner: userId})
            .exec(function (err, model) {
                if (err) {
                    return callback(err);
                }

                console.log('Profile find by id', userId);

                if (model) {
                    console.log('find succesful ');
                    console.log( model.firstName, ' ', model.lastName,'  ', model.dateOfCreating,model.owner);

                    return callback(null, model.toJSON());
                } else {
                    console.log('No one was found');
                    return callback(new Error('No one was found with such owner ID'));
                }
            });
    };
};

module.exports = ProfileHandlers;