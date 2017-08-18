// Takes a folder as an input and recursively deletes its contents
var fs = require('fs');

module.exports = function empty(dirPath, callback) {
	try { 
		var files = fs.readdirSync(dirPath);
	} catch(e) {
		console.error(e);
	}
	if (files.length > 0) {
		for (var i = 0; i < files.length; i++) {
			var filePath = dirPath + '/' + files[i];
			if (fs.statSync(filePath).isFile()) {
				fs.unlinkSync(filePath);
			} else {
				empty(filePath);
			}
		}
	}
	if(callback) callback();
}