module.exports = new function () {

    var nodemailer = require('nodemailer');
    var _ = require('../public/js/libs/underscore/underscore-min.js');
    var fs = require('fs');
    //var CONSTANTS = require('../constants/index');
    var CONST = require('../config/development');
    require('../config/development');

    this.sendReport = function (options, callback) {
        //console.dir( options.templateData);
        //console.log( options.templateData.serviceType);

        var mailOptions = {
            from: options.from,
            to: options.mailTo,
            subject: options.title,
            //html: _.template(fs.readFileSync('public/templates/mail/confirmRegistration.html', encoding = "utf8"), templateData)

            html: _.template(fs.readFileSync(options.templateName, encoding = "utf8"))(options.templateData)
        };

        deliver(mailOptions, callback);
    };

    function deliver(mailOptions, callback) {
        var smtpTransport = nodemailer.createTransport({
            service: process.env.MAIL_SERVICE,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        });

        smtpTransport.sendMail(mailOptions, function (err, response) {
            if (err) {
                console.error('Email did not send: ' + err);
                if (callback && typeof callback === 'function') {
                    callback(err, null);
                }
            } else {
                console.log('Email sent: ');
                console.log(response);
                if (callback && typeof callback === 'function') {
                    callback(null, response);
                }
            }
        });
    };
};

