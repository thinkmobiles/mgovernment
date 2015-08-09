var express = require( 'express' );
var router = express.Router();

var TestTRAHandler = require('../handlers/testTRAHandler');

module.exports = function(db) {
    'use strict';

    var testTRAHandler = new TestTRAHandler(db);

    router.get('/checkWhois', testTRAHandler.testWhois);
    router.get('/checkWhoisAvailable', testTRAHandler.testWhoisCheck);
    router.get('/searchMobile', testTRAHandler.searchMobileImei);
    router.get('/searchMobileBrand', testTRAHandler.searchMobileBrand);
};