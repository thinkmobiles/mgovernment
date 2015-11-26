var CONST = require('../constants');
var RESPONSE = require('../constants/response');

var AccessHTTP = function () {
    'use strict';

    this.appAccessHTTP = function(req, res, next)  {
        var userAgent = req.headers['user-agent'];
        console.log('userAgent: ' + userAgent);
        var checkMobileDevice = userAgent.indexOf('Android');

        if (checkMobileDevice === -1) {
            checkMobileDevice = userAgent.indexOf('iPhone');
            if (checkMobileDevice === -1) {
                checkMobileDevice = userAgent.indexOf('iPad');
            }
        }

        if (checkMobileDevice > -1) {

            if (req.headers.appkey === CONST.APPLICATION_KEY_FOR_TOKEN) {
                next();
            } else {
                res.status(403).send(RESPONSE.AUTH.NO_PERMISSIONS);
            }

        } else {
            next();
        }
    };
};

module.exports = AccessHTTP;