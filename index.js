/*
*Primary file for the Api
*
*/

// Dependencies
const fs = require('fs');
const url = require('url');
const http = require('http');
const https = require('https');
const Config = require('./config');
const _data = require('./lib/data');
const stringDecoder = require('string_decoder').StringDecoder;

// Testing
// @TODO delete this
_data.delete('test', 'test', console.log);


// Instatiating the http server
const httpServer = http.createServer(function(req, res){
    unifiedServer(req, res);
});

// Start the server, and have it listen on port 3000
httpServer.listen(Config.httpPort, function(){
    console.log(`Server is listening on port ${ Config.httpPort }`);
});

// Instatiating the https server
const httpsServerOptions = {
    'key' : fs.readFileSync('./https/key.pem'),
    'cert' : fs.readFileSync('./https/cert.pem')
}

// Start the https server, and have it listen on httpsPort from config.
const httpsServer = https.createServer(httpsServerOptions, function(req, res){
    unifiedServer(req, res);
});
httpsServer.listen(Config.httpsPort, function(){
    console.log(`Server is listening on port ${ Config.httpsPort }`);
});

// All the server logic for both http and https server
const unifiedServer = function(req, res) {
    
    // Get the URL and parse it
    const parsedUrl = url.parse(req.url, true);
    
    // Get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get QueryString as an Object
    const queryStringObject = parsedUrl.query;

    // get the HTTP Method
    const method =  req.method.toLowerCase();

    // Get the hearder as an object
    const headers = req.headers;

    // Get the payload, if any
    const decoder = new stringDecoder('utf-8');
    const buffer = '';
    req.on('data', function(data){
        buffer += decoder.write(data);
    });
    req.on('end', function(){
        buffer += decoder.end();

        // Choose the handler this request should go to. If one is not found, use the notFound handler
        const chosendHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Construct the data object to send to the handler
        const data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
         };

         // Route the request to the handler specified in the router
         chosendHandler(data, function(statusCode, payload){
            // Use the status code called back by the handler, or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // Use the payload called back by the handler, or default to {}
            payload = typeof(payload) == 'object' ? payload : {};

            // Convert the payload to a string
            const payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log the request path
            console.log('Returning this response ', statusCode, payloadString);
        });
    });
}

// Define the handlers
const handlers = {};

// Ping handler
handlers.ping = function(data, callback) {
    // Callback a http status code, and a payload object
    callback(200, {'name': 'ping handler'});
};

// Not found handler
handlers.notFound = function(data, callback) {
    callback(404);
};

// Define a request router
const router = {
    'ping' : handlers.ping
}