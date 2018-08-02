/*
* Librarry for storing and editing data
*
*/

// Dependencies
const Fs = require('fs');
const Path = require('path');

// Container for module (to be exported)
const lib = {};

// Base directory for the data folder
lib.baseDir = Path.join(__dirname, '/../.data');

// Write data to a file
lib.create = function(dir, file, data, callback) {
	// Open the file for writing
	Fs.open(`${lib.baseDir}/${dir}/${file}.json`, 'wx', function(err, fd){
		if(!err && fd) {
			// Convert data to string
			let stringData = JSON.stringify(data);

			// Write to file and close it.
			Fs.writeFile(fd, stringData, function(err){
				if(!err) {
					Fs.close(fd, function(err) {
						if(!err) {
							return callback(false);
						} else {
							return callback('Error closing new file.');
						}
					});
				} else {
					return callback('Error writing to new file.')
				}
			});
		} else {
			return callback('could not create new file, it may already exists');
		}
	});
}

// Read data from a file

lib.read = function(dir, file, callback) {
	Fs.readFile(`${lib.baseDir}/${dir}/${file}.json`, 'utf8', function(err, data) {
		return callback(err, data);
	});
}

// Update data in a file
lib.update = function(dir, file, data, callback) {
	// Open the file for wirting
	Fs.open(`${lib.baseDir}/${dir}/${file}.json`, 'r+', function(err, fd){
		if(!err && fd) {
			// Convert data to string
			let stringData = JSON.stringify(data);

			// Truncate the data of a file
			Fs.truncate(fd, function(err){
				if(!err) {
					// Write to file and close it.
					Fs.writeFile(fd, stringData, function(err){
						if(!err) {
							Fs.close(fd, function(err) {
								if(!err) {
									return callback(false);
								} else {
									return callback('Error closing Existing file.');
								}
							});
						} else {
							return callback('Error writing to Existing file.')
						}
					})
				} else {
					return callback('Error truncating the file.');
				}
			})
		} else {
			return callback('Could not open the file for updating!!!');
		}
	});
}

// Delete a file

lib.delete = function(dir, file, callback) {
	// To Delete a file use Unlnk
	Fs.unlink(`${lib.baseDir}/${dir}/${file}.json`, function(err) {
		if(!err) {
			return callback(false);
		} else {
			return callback('Error while deleting the file.');
		}
	})
}


// Export the module
module.exports = lib;