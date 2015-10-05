
module.exports = function(db) {
    "use strict";

    require('./user')(db);
    require('./attachment')(db);
    require('./sessions')(db);
    require('./layout')(db);
    require('./service')(db);
    require('./adminHistoryLog')(db);
    require('./userHistoryLog')(db);
    require('./image')(db);
    require('./feedback')(db);
    require('./innovation')(db);
    require('./emailReport')(db);
};