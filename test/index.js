'use strict';

var app = require('../app');

//TODO CHECK THIS! temporary set for my tests
//require('./testHandlers/users');
//require('./testHandlers/layouts');
//require('./testHandlers/services');
//require('./testHandlers/userServices');
//require('./testHandlers/userServices');

require('./testHandlers/usersAuth'); //added register
//require('./testHandlers/traServices CRM');
//require('./testHandlers/traServices WHOIS_IMEI_BRAND');
//require('./testHandlers/traServices Complains ServiceProvider_TRA Services');
//require('./testHandlers/traServices Complains Enquiries_Suggestion ');
//require('./testHandlers/traServices Complains SMSSpam_HelpSalim_PoorCoverage');
require('./testHandlers/userFeedback');