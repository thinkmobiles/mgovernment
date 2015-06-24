
module.exports = function(db) {
    "use strict";

    require('./user')(db);
    require('./profile')(db);
    require('./sessions')(db);
    require('./layout')(db);

};