var CONST = require('../constants');
var TRA_SERVICES_INFO = require('../constants/traServicesInfo');

var StaticServicesInfo = function(db) {
    'use strict';

    var mongoose = require('mongoose');
    var StaticServicesInfo = db.model(CONST.MODELS.STATIC_SERVICE_INFO);

    checkAndCreateOnServerStart();

    function checkAndCreateOnServerStart () {

        StaticServicesInfo
            .find(function (err, collection) {
                if (err) {
                    return next(err);
                }

                if (collection.length < 1) {
                    for(var key in TRA_SERVICES_INFO.EN) {
                         var staticServiceInfo = new StaticServicesInfo({
                             serviceName: key,
                             profile: {
                                 'Name': {
                                     EN: TRA_SERVICES_INFO.EN[key]['Name'],
                                     AR: TRA_SERVICES_INFO.AR[key]['Name']
                                 },
                                 'About the service': {
                                     EN: TRA_SERVICES_INFO.EN[key]['About the service'],
                                     AR: TRA_SERVICES_INFO.AR[key]['About the service']
                                 },
                                 'Service Package': {
                                     EN: TRA_SERVICES_INFO.EN[key]['Service Package'],
                                     AR: TRA_SERVICES_INFO.AR[key]['Service Package']
                                 },
                                 'Expected time': {
                                     EN: TRA_SERVICES_INFO.EN[key]['Expected time'],
                                     AR: TRA_SERVICES_INFO.AR[key]['Expected time']
                                 },
                                 'Officer in charge of this service': {
                                     EN: TRA_SERVICES_INFO.EN[key]['Officer in charge of this service'],
                                     AR: TRA_SERVICES_INFO.AR[key]['Officer in charge of this service']
                                 },
                                 'Required documents': {
                                     EN: TRA_SERVICES_INFO.EN[key]['Required documents'],
                                     AR: TRA_SERVICES_INFO.AR[key]['Required documents']
                                 },
                                 'Service fee': {
                                     EN: TRA_SERVICES_INFO.EN[key]['Service fee'],
                                     AR: TRA_SERVICES_INFO.AR[key]['Service fee']
                                 },
                                 'Terms and conditions': {
                                     EN: TRA_SERVICES_INFO.EN[key]['Terms and conditions'],
                                     AR: TRA_SERVICES_INFO.AR[key]['Terms and conditions']
                                 }
                             }
                         });
                        staticServiceInfo
                            .save(function(err,model){
                                if (err) {
                                    return next(err);
                                }
                            })
                    }
                }

            });
    }

    this.getAllServicesInfo = function (req, res, next) {

        StaticServicesInfo
            .find(function(err,collection) {
                if (err) {
                    return next(err);
                }

                return res.status(200).send(collection);
            })
    };

    this.getServiceById = function (req, res, next) {
        var id = req.params.id;

        StaticServicesInfo
            .findById(id, function(err, model) {
                if (err){
                    return next(err);
                }
                return res.status(200).send(model);
            })

    };

    this.updateServiceByEdit = function (req, res, next) {
        var id = req.params.id;
        var body = req.body;
        var serviceData = {
            serviceName: body.serviceName,
            profile: {
                'Name': {
                    EN: body.profile['Name'].EN,
                    AR: body.profile['Name'].AR
                },
                'About the service': {
                    EN: body.profile['About the service'].EN,
                    AR: body.profile['About the service'].AR
                },
                'Service Package': {
                    EN: body.profile['Service Package'].EN,
                    AR: body.profile['Service Package'].AR
                },
                'Expected time': {
                    EN: body.profile['Expected time'].EN,
                    AR: body.profile['Expected time'].AR
                },
                'Officer in charge of this service': {
                    EN: body.profile['Officer in charge of this service'].EN,
                    AR: body.profile['Officer in charge of this service'].AR
                },
                'Required documents': {
                    EN: body.profile['Required documents'].EN,
                    AR: body.profile['Required documents'].AR
                },
                'Service fee': {
                    EN: body.profile['Service fee'].EN,
                    AR: body.profile['Service fee'].AR
                },
                'Terms and conditions': {
                    EN: body.profile['Terms and conditions'].EN,
                    AR: body.profile['Terms and conditions'].AR
                }
            }
        };

        StaticServicesInfo
            .findByIdAndUpdate(id, {$set: serviceData}, function(err, model){
                if (err) {
                    return next(err);
                }
                res.status(200).send({success: 'Success'})
            })
    };

};

module.exports = StaticServicesInfo;