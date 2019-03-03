/*
* Helper Utility Methods
* 
*/

// Dependencies
var Crypto = require('crypto');
var Config = require('./config');

var helpers = {};

// Container for all helper functions
helpers.hash = function(password) {
    if(typeof(password) === 'string' && password.trim().length > 0) {
        return Crypto.createHmac('sha256', Config.hashingSecret).update(password).digest('hex');
    } else {
        return false;
    }
}

// Parse a JSON string in all cases, without throwing
helpers.parseJSONToObject = function(payload){
    try {
        return JSON.parse(payload);
    } catch(e) {
        return {}
    }
}

// Export the module
module.exports = helpers;