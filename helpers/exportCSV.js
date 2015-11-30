var ExportCSV = function() {
    'use strict';

    var csv = require('csv');
    var moment = require('moment');
    var fs = require('fs');
    var mkdirp = require('mkdirp');
    var path = './public/downloads/csv';

    function isExistPath (path, callback) {
        fs.exists(path, function (exists) {
            var mkdirp;

            if (exists) {
                if (callback && (typeof callback === 'function')) return callback(null);
            } else {
                mkdirp = require('mkdirp');
                mkdirp(path, function (err) {
                    if (err) {
                        if (callback && (typeof callback === 'function')) return callback(err, null);
                    } else {
                        if (callback && (typeof callback === 'function')) return callback(null);
                    }
                });
            }
        });
    }

    this.sendCsvFile = function (res, fileName, fileData, callback) {
        var filePath = path + '/' +  fileName + '.csv';

        isExistPath(path, function (err) {
            if (err) {
                if (callback && (typeof callback === 'function')) return callback(err, null);
            } else {
                fs.writeFileSync(filePath, fileData);

                res.download(filePath, callback);
            }
        });
    }

    this.generateCsvData = function (params, callback) {
        //options.columns and options.rows are required parameters!
        var errors = [];
        var data = '';
        var dateFormat = (params && params.dateFormat) ? params.dateFormat : null;
        var delimiter  = (params && params.delimiter)  ? params.delimiter  : ",";
        var hasBooleans = (params && params.hasBooleans)  ? params.hasBooleans  : null;
        var columns;
        var stringifier;
        var counter;

        if (!params) {
            //logWriter.log(destination + ".generateCsvData()", "Not enough incoming parameters.");
            if (callback && (typeof callback === 'function')) callback("Not enough incoming parameters.", null);
            return;
        } else {
            columns = params.columns;
        }

        stringifier = csv.stringify({delimiter: delimiter, columns: params.columns, header: true, quoted: true});
        stringifier.on('readable', function() {
            var row;
            while (row = stringifier.read()) {
                data += row;
            }
        });
        stringifier.on('error', function(err) {
            errors.push(err);
        });
        stringifier.on('finish', function() {
            if (errors.length == 0) {
                if (callback && (typeof callback === 'function')) callback(null, data);
            } else {
                if (callback && (typeof callback === 'function')) callback(errors, null);
            }
        });
        stringifier.on('record', function (row) {
            if (dateFormat) {
                columns.forEach(function (colName) {
                    var colData = row [colName];
                    if (colData && (colData instanceof Date)) {
                        row [colName] = moment(colData).format(dateFormat);
                    }
                });
            }
            if (hasBooleans) {
                columns.forEach(function (colName) {
                    var colData = row [colName];
                    if (typeof colData === 'boolean' ) {
                        if (colData) {
                            row [colName] = 'yes'
                        } else {
                            row [colName] = 'no'
                        }
                    }
                });
            }
        });

        //add rows to stringifier.
        //stringifier.end() will trigger the 'finish' event:
        counter = 0;
        if (params.rows && params.rows.length) {
            params.rows.forEach(function (row) {
                stringifier.write(row);
                counter++;
                if (counter == params.rows.length) {
                    stringifier.end();
                }
            });
        } else {
            stringifier.end();
        }
    };

    this.tempCSVGenerator = function(res, Data, fileName) {

        var dataExport = toCsv(Data);
        sendCsvFile(res, dataExport, fileName);

        function toCsv(objArray, sDelimiter, cDelimiter) {
            var i, l, names = [], name, value, obj, row, output = "", n, nl;

            // Initialize default parameters.
            if (typeof (sDelimiter) === "undefined" || sDelimiter === null) {
                sDelimiter = '';
            }
            if (typeof (cDelimiter) === "undefined" || cDelimiter === null) {
                cDelimiter = ",";
            }

            for (i = 0, l = objArray.length; i < l; i += 1) {
                // Get the names of the properties.
                obj = objArray[i];
                row = "";
                if (i === 0) {
                    // Loop through the names
                    for (name in obj) {
                        if (obj.hasOwnProperty(name)) {
                            names.push(name);
                            row += [sDelimiter, name, sDelimiter, cDelimiter].join("");
                        }
                    }
                    row = row.substring(0, row.length - 1);
                    output += row;
                }

                output += "\n";
                row = "";
                for (n = 0, nl = names.length; n < nl; n += 1) {
                    name = names[n];
                    value = obj[name];
                    if (n > 0) {
                        row += ","
                    }
                    row += toCsvValue(value, '');
                }
                output += row;
            }

            return output;

        }
    };

        function toCsvValue(theValue, sDelimiter) {
            var t = typeof (theValue), output;

            if (typeof (sDelimiter) === "undefined" || sDelimiter === null) {
                sDelimiter = '"';
            }

            if (t === "undefined" || t === null) {
                output = "";
            } else if (t === "string") {
                output = sDelimiter + theValue + sDelimiter;
            } else {
                output = String(theValue);
            }

            return output;
        }

    function sendCsvFile (res, fileData, fileName) {

        var filePath = path + '/' + fileName + '.csv';
        var downloadPath = '/downloads/csv/' + fileName + '.csv';

        isExistPath(path, function(err) {
            if (err) { return next(err); }
            fs.writeFileSync(filePath, fileData);
            //res.download(filePath);
            return res.status(200).send({path: downloadPath});
        });
    }

    function isExistPath (path, callback) {
        fs.exists(path, function (exists) {
            if (exists) {
                if (callback && (typeof callback === 'function')) return callback(null);
            } else {
                mkdirp(path, function (err) {
                    if (err) {
                        if (callback && (typeof callback === 'function')) return callback(err, null);
                    } else {
                        if (callback && (typeof callback === 'function')) return callback(null);
                    }
                });
            }
        });
    }

};
module.exports = ExportCSV;
