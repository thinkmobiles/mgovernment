
module.exports = function(db) {
    "use strict";

    require('./user')(db);
    require('./sessions')(db);
    require('./layout')(db);
    require('./service')(db);
    require('./historyLog')(db);

};