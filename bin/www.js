#!/usr/bin/env node

/**
 * Module dependencies.
 */
let app = require('../app');
let debug = require('debug')('learnning-english-server:server');
let http = require('http');
let https = require('https');
let fs = require('fs');
const httpsPort = 443;

/**
 * ------------------------------------------------------------
 * create https server
 */
const options = {
    key: fs.readFileSync('../ssl/www.all2key.cn.key'),
    // It will being cause to weapp not connect to https server when direct use crt file
    //ca: [fs.readFileSync('./ca/ca.crt')],
    cert: fs.readFileSync('../ssl/www.all2key.cn.pem')
};

let httpsServer = https.createServer(options, app);
httpsServer.listen(httpsPort, function () {
    console.log('Https server is listening on port ', httpsPort);
});
//-------------------------------------------------------------

/**
 * Get port from environment and store in Express.
 */
let port = normalizePort(process.env.PORT || '80');
app.set('port', port);

/**
 * Create HTTP server.
 */
let server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    let port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    //debug('Listening on ' + bind);
    console.log('Http server is listening on ' + bind);
}
