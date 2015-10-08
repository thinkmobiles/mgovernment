
var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose');
var http = require('http');
var bodyParser = require('body-parser');
var server = http.createServer(app);
var connectOptions;
var mainDb;
var session = require('express-session');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongostore')(session);
var methodOverride = require('method-override');

app.use(logger('dev'));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static( path.join(__dirname, 'public') ) );
app.use(bodyParser.json({strict: false, limit: 1024 * 1024 * 200}) );
app.use(bodyParser.urlencoded( { extended: false } ) );
app.use(cookieParser());

process.env.NODE_ENV = 'production';

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}

require('./config/' + process.env.NODE_ENV);

connectOptions = {
    db: { native_parser: false },
    server: { poolSize: 5 },
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    w: 1,
    j: true
};

if (process.env.NODE_ENV == 'production') {

    connectOptions.replset = {
        rs_name: process.env.DB_REPLICASET,
        poolSize : 5,
        socketOptions : {
            keepAlive : 1,
            connectTimeoutMS : 1000
        }
    }
}

mainDb = mongoose.createConnection(process.env.DB_HOST);

mainDb.on('error', console.error.bind( console, 'connection error:' ) );
mainDb.once('open', function() {

    var Schedule = require('./helpers/schedule');
    var schedule = new Schedule(mainDb);

    console.log("Connection to " + process.env.DB_NAME + " is success");

    app.use(session({
        secret: '123sesstrasecret90892378somecatcode',
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({db: {
            name: 'sessions',
            servers:[
                {
                    host: "192.168.90.51",
                    port: "27017"
                },
                {
                    host: "192.168.90.52",
                    port: "27017"
                },
                {
                    host: "192.168.91.74",
                    port: "27017"
                }
            ],
            replicaSetOptions: {
                rs_name: process.env.DB_REPLICASET
            }
        }})
    }));

    require('./routes')(app, mainDb);

    server.listen(8080, function () {
        console.log('Express server listening on port: ' + 8080);
        console.log('HOST: ' + process.env.HOST);
        console.log('DB_HOST: ' + process.env.DB_HOST);
    });
});

module.exports = app;

