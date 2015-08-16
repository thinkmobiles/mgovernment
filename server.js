var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {

    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died, reason: ' + code || signal);

        /*if (!worker.suicide) {
            cluster.fork();
        }*/
    });

} else {
    require('./app');
}