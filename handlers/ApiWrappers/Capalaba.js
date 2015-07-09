var CONST = require('../constants');
var RESPONSE = require('../constants/response');

var Capalaba = function(db) {

    var session = new SessionHandler(db);
    var User = db.model(CONST.MODELS.USER);
    var userId = req.session.uId;
    var userCookiesString;
    var userCookiesObject;
    var userCookies;

    this.createSendDataToCapalabaFunction = function (serviceOptions, serviceAccount, userRequestBody) {
        return function (callback) {

            var cookie;

            if (!serviceAccount.userCookie) {
                requestWithSignIn();

            } else {

                cookie = request.cookie(serviceAccount.userCookie);
                userCookiesObject.setCookie(cookie, serviceOptions.baseUrl);

                async.series([createSendRequestFunction()], function (err, results) {
                    if (err) {
                        console.log(err);
                        //return callback(err);
                        return requestWithSignIn();
                    }
                    return callback(null, results);
                });
            }

            function requestWithSignIn() {
                var tasks = [];

                tasks.push(createUserSignInFunction());
                tasks.push(createSendRequestFunction());
                tasks.push(createSaveCookieFunction());

                async.series(tasks, function (err, results) {
                    if (err) {
                        console.log(err);
                        return callback(err);
                    }
                    return callback(null, results);
                });
            }

            function createSendRequestFunction() {
                return function (callback) {

                    var serviceUrl = serviceOptions.baseUrl + serviceOptions.url;

                    request(serviceUrl, {
                        method: serviceOptions.method,
                        headers: {'User-Agent': 'Kofevarka'},
                        body: userRequestBody,
                        jar: userCookiesObject,
                        json: true
                    }, function (err, res, body) {
                        if (!err && res.statusCode == 200) {

                            console.log(' ----------------------------------------------------------- User:', serviceOptions.method, ': ', serviceUrl, ' ', body);
                            userCookiesString = userCookiesObject.getCookieString(serviceUrl);
                            userCookies = userCookiesObject.getCookies(serviceUrl);
                            console.log('Cookies USER REQUEST:', userCookiesString);
                            return callback(null, res.body)
                        }
                        return callback(err + res.statusMessage)
                    });
                }
            }

            function createUserSignInFunction() {
                return function (callback) {

                    var SignInData = {
                        password: serviceAccount.pass,
                        username: serviceAccount.login
                    };

                    var serviceUrl = 'http://134.249.164.53:7788/signIn';

                    userCookiesObject = request.jar();
                    request.post(serviceUrl, {
                        headers: {'User-Agent': 'Kofevarka'},
                        jar: userCookiesObject,
                        json: true,
                        body: SignInData
                    }, function (err, res, body) {

                        if (!err && res.statusCode == 200) {

                            console.log(' ----------------------------------------------------------- User LogIn:', body);
                            userCookiesString = userCookiesObject.getCookieString(serviceUrl);
                            userCookies = userCookiesObject.getCookies(serviceUrl);
                            console.log('Cookies USER REQUEST:', userCookiesString);
                            return callback(null, res.body)
                        }
                        return callback(err)
                    });
                }
            }

            function createSaveCookieFunction() {
                return function (callback) {

                    User
                        .update({'_id': userId, 'accounts.serviceProvider': serviceOptions.serviceProvider}, {
                            $set: {
                                'accounts.$.userCookie': userCookiesString,
                                'accounts.$.cookieUpdatedAt': new Date()
                            }
                        }, function (err, data) {
                            if (err) {
                                return callback(err);
                            }
                            return callback(null, 'Cookies saved in User');
                        });
                }
            }
        };
    };
};

module.exports = Capalaba;