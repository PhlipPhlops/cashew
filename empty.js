// Takes a folder as an input and recursively deletes its contents
var fs = require('fs');

function empty(dirPath, removeBaseDir) {
	if (removeBaseDir === undefined) {
		removeBaseDir = false;
	}
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
	if (removeBaseDir) {
		fs.rmdirSync(dirPath);
	}
}

module.exports = empty;