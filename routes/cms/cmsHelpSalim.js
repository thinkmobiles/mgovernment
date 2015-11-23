var express = require('express');
var router = express.Router();

var HelpSalim = require('../../handlers/adminHelpSalim');

module.exports = function(db){
    'use strict';

    var helpSalim = new HelpSalim(db);

    router.route('/')
        .get(helpSalim.getAllSalim);

    router.route('/:id')
        .delete(helpSalim.deleteSalimById);

    router.route('/getCount')
        .get(helpSalim.getCount);

    return router;
};