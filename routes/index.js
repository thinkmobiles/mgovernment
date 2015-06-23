/**
 * Created by User on 27.04.2015.
 */
module.exports = function(app, db){
    var logWriter = require('../helpers/logWriter')();
    var models = require('../models/index')(db);
    var usersRouter = require('./users')(db);


    /*var Test = require( '../handlers/schedule' );
     var test0 = new Test(db);*/


    app.get('/', function(req, res, next){
        res.status(200).send( 'Express start succeed' );
    });

    app.use('/user', usersRouter);


    function notFound(req, res, next){
        next();
    }

    function errorHandler( err, req, res, next ) {
        var status = err.status || 500;

        if( process.env.NODE_ENV === 'production' ) {
            if(status === 404 || status === 401){
                logWriter.log( '', err.message + '\n' + err.stack );
            }
            res.status( status );
        } else {
            if(status !== 401) {
                logWriter.log( '', err.message + '\n' + err.stack );
            }
            res.status( status ).send( err.message + '\n' + err.stack );
        }

        if(status === 401){
            console.warn( err.message );
        } else {
            console.error(err.message);
            console.error(err.stack);
        }
    }
    app.use( notFound );
    app.use( errorHandler );
};