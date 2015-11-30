var CONST = require('../constants');

module.exports = function(db){
  'use strict';

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var staticServiceInfo = new Schema ({
      serviceName: String,
      profile: {
        'Name': {
          EN: String,
          AR: String
        },
        'About the service' : {
          EN: String,
          AR: String
        },
        'Service Package': {
          EN: String,
          AR: String
        },
        'Expected time': {
          EN: String,
          AR: String
        },
        'Officer in charge of this service': {
          EN: String,
          AR: String
        },
        'Required documents': {
          EN: String,
          AR: String
        },
        'Service fee': {
          EN: String,
          AR: String
        },
        'Terms and conditions': {
          EN: String,
          AR: String
        }
      }
    }, {collection: CONST.MODELS.STATIC_SERVICE_INFO + 's'});

  db.model(CONST.MODELS.STATIC_SERVICE_INFO, staticServiceInfo);
};