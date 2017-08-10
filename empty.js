// Takes a folder as an input and recursively deletes its contents
var fs = require('fs');

function empty(dirPath) {
	try { 
		var files = fs.readdirSync(dirPath);
	} catch(e) {
		return;
	}
	if (files.length > 0) {
		for (var i = 0; i < files.length; i++) {
			var filePath = dirPath + '/' + files[i];
			if (fs.statSync(filePath).isFile()) {
				fs.unlinkSync(filePath);
			} else {
				empty(filePath, true);
			}
		}
	}
}

module.exports = empty;