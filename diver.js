// Recursively retrieves all .dcm files in a folder 
// and writes their paths to a variable in a separate file

// BUG: Requires .dcm files to be at least one folder deeper than the entry point

var fs = require('fs');

var baseDir = '/tmp/papaya/data/';
var dirArray = [];
var indexArray = [0];
var levelPointer = 0
var outputImageArray = [];


function getDir(level) {
	// Returns a string path to the directory, or path at <level> levels deep
	var dirString = baseDir;
	if (typeof level != 'number') {
		level = levelPointer;
	}
	for (var i = 0; i < level; i++) {
		dirString += dirArray[i][indexArray[i]] + "/";
	}
	return dirString;
}

function list(level) {
	// Lists the contents of the current directory
	return fs.readdirSync(getDir(level));
}

function appendDir(level) {
	// Appends the contents of the directory to dirArray and increases the current level
	dirArray.push(list(level));
	indexArray.push(0);
	levelPointer++;
}

function isDirectory() {
	// Returns true if the object at the current index of the current level is a directory
	return fs.lstatSync(getDir() + list()[indexArray[levelPointer]]).isDirectory()
}

function storePaths() {
	// Pushes the path of every .dcm file in the current directory to outputImageArray
	for (var i = 0; i < list().length; i++) {
		if (list()[i].slice(list()[i].length-4, list()[i].length) == '.dcm') {
			outputImageArray.push(getDir() + list()[i]);
		}
	}
}

function debug() {
	// Display debugger text
	console.log("levelPointer: " + levelPointer);
	console.log("getDir: " + getDir());
	console.log("list: " + list());
	console.log("indexArray: " + indexArray);
	console.log("");
}

function recursiveStore() {
	// Scans directory, if it hits a folder it changes to that directory and repeats
	// At end of folder's contents, stores paths to all .dcm files in current directory
	appendDir(levelPointer);
	for (var i = 0; i < list().length; i++) {
		if (isDirectory()) {
			// Recursion call
			recursiveStore();
		}
		indexArray[levelPointer]++;
	}
	storePaths();
	levelPointer--;
	indexArray.pop();
	dirArray.pop();
}

function outputToString() {
	// Takes the outputImageArray and turns it into a papaya readable 
	// string, writes the short imageloader script to file
	var finalString = 'var params = [];\nparams["images"] = [['
	for (var i = 0; i < outputImageArray.length; i++) {
		if (i == outputImageArray.length - 1) { // Handles final entry
			finalString += "'" + outputImageArray[i].slice(baseDir.length-5) + "'";
		} else { // Otherwise appends <'./path/to/file'> to final string
			finalString += "'" + outputImageArray[i].slice(baseDir.length-5) + "',";
		}
	}
	finalString += ']];'
	return finalString
}

module.exports = function dive(callback) {
	outputImageArray = [];

	recursiveStore(); // Updates outputImageArray with paths
	fs.writeFileSync("/tmp/papaya/imageLoader.js", outputToString(), callback());

	console.log("Loaded images");
}