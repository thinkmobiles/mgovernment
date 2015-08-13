module.exports = new function () {

    var nodemailer = require('nodemailer');
    var sgTransport = require('nodemailer-sendgrid-transport');
    var _ = require('../public/js/libs/underscore/underscore-min.js');
    var fs = require('fs');
    require('../config/development');

    this.sendReport = function (options, callback) {

        var mailOptions = {
            from: options.from,
            to: options.mailTo,
            subject: options.title,
            html: _.template(fs.readFileSync(options.templateName, encoding = "utf8"))(options.templateData)
        };

        deliver(mailOptions, callback);
    };

    function deliver(mailOptions, callback) {

        var authOptions = {
            auth: {
                api_user: process.env.MAIL_USERNAME,
                api_key: process.env.MAIL_PASSWORD
            }
        };

        var mailerClient = nodemailer.createTransport(sgTransport(authOptions));

        mailerClient.sendMail(mailOptions, function (err, response) {
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
    }
};

