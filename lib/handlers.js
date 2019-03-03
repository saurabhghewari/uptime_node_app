/*
* Request Handlers
* 
*/

// Dependencies
const _data = require('./data');
const Helpers = require('./helpers');

// Define the handlers
const handlers = {};

// Ping handler
handlers.ping = function(data, callback) {
    // Callback a http status code, and a payload object
    callback(200, {'name': 'ping handler'});
};

// Users Handlers
handlers.users = function(data, callback) {
    // Callback a http status code, and a payload object

    const acceptableMethods = ['post', 'get', 'put', 'delete'];

    if(acceptableMethods.includes(data.method)) {
        handlers._users[data.method](data, callback)
    } else {
        callback(405);
    }
}

// Users Private methods used by Users Handlers
handlers._users = {};

// Users POST method
handlers._users.post = function(data, callback) {
    // Check that all required fields are filled out
    var { 
        firstName = false,
        lastName = false,
        phone = false,
        password = false,
        tosAgreement = false } = data.payload

    if(firstName && lastName && phone && password && tosAgreement) {
        // Make sure if user already exists
        _data.read('users', phone, function(err, data) {
            if(err) {
                // Hash the password
                var hashPassword = Helpers.hash(password);

                // Create user object if password is sucessfully hashed
                if(hashPassword){
                    var UserObject = {
                        firstName,
                        lastName,
                        phone,
                        hashPassword,
                        tosAgreement
                    }
    
                    // Store the user
                    _data.create('users', phone, UserObject, function(err, data){
                        if(!err){
                            return callback(200)
                        } else {
                            return callback(500, { 'Error': `Error while create user with ${phone}` })
                        }
                    })   
                } else {
                    return callback(500, { 'Error': 'Error while hashing the password.' })
                }
            } else {
                // User already exists
                return callback(419, { 'Error': `User with ${phone} already exists!` })
            }
        })
    } else {
        return callback(400, { 'Error': "Missing Required fields" })
    }
}

// Users GET method
handlers._users.get = function(data, callback) {
    
}

// Users PUT method
handlers._users.put = function(data, callback) {
    
}

// Users DELET method
handlers._users.delet = function(data, callback) {
    
}


// Not found handler
handlers.notFound = function(data, callback) {
    callback(404);
};

// Export the handlers object
module.exports = handlers
