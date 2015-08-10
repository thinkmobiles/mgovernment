module.exports = function () {

    var nodemailer = require('nodemailer');
    var CONSTANTS = require('../constants/index');

    this.sendReport = function (options, callback) {

        var templateOptions = {
            trainerFirstName: options.trainerFirstName,
            host: process.env.HOST,
            confirmToken: options.confirmToken
        };

        var confirmSubject = EMAIL_CONST.CONFIRM_REGISTRATION_SUBJECT;
        confirmSubject = confirmSubject.replace('<trainer_business_name>', options.trainerBusinessName);

        var mailOptions = {
            from: FROM_TITLE,
            to: options.email,
            subject: confirmSubject,
            html: _.template(fs.readFileSync('public/templates/mail/confirmRegistration.html', encoding = "utf8"), templateOptions)
        };

        deliver(mailOptions, callback);
    };

    function deliver(mailOptions, cb) {
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
                if (cb && typeof cb === 'function') {
                    cb(err, null);
                }
            } else {
                console.log('Email sent: ');
                console.log(response);
                if (cb && typeof cb === 'function') {
                    cb(null, response);
                }
            }
        });
    };
};

