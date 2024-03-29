
var logWriter = function () {
    var fs = require('fs');
    function erfunc(destination, errorString) {
        var _dest = 'log.txt';
        var _error = errorString;
        fs.open(_dest, "a", 0644, function (err, file_handle) {
            if (!err) {
                var date = new Date();
                var res = "------------------------------" + destination + "-------------------------------------------------------\r\n"
                    + date + "\r\n" + _error + "\r\n"
                    + "---------------------------------------------------------------------------------------------------------\r\n";

                fs.write(file_handle, res, null, 'utf8', function (err, written) {
                    if (!err) {
                        fs.close(file_handle);
                    } else {
                        console.log(err);
                    }
                });
            } else {
                console.log(err);
            }
        });
    }

    function errorHandler(res, callback, errorText){
        "use strict";
        return function(err, result){
            if(err){
                var errText = errorText || 'Internal server Error';
                var stack = err.stack || err;

                res.status(500 ).send({error: errText});
                erfunc(stack);
            } else {
                callback(result);
            }
        }
    }
    return {
        log: erfunc,
        errorHandler: errorHandler
    }
};
module.exports = logWriter;