// Takes a SeriesInstanceUID and an API Key as inputs and returns a .zip
// of whatever images the TCIA database returns
var request = require('request');
var fs = require('fs');

var Minizip = require('node-minizip'); // To unzip file
var onezip = require('onezip');
var decompress = require('decompress');
var StreamZip = require('node-stream-zip');

var path = require('path');
var empty = require('./empty'); 
var dive = require('./diver'); // Loads all .dcm files after download

module.exports = function retriever(SeriesInstanceUID, APIKey, callback) {
	// var dataDir = __dirname + '/papaya/data';
	if (SeriesInstanceUID == 'favicon.ico') {
		return;
	}
	var dataDir = './papaya/data';
	empty(dataDir); // Empties output directory

	var baseURL = 'http://services.cancerimagingarchive.net/services/v4';
	var queryURL = baseURL + '/TCIA/query/getImage?SeriesInstanceUID=' + SeriesInstanceUID + '&api_key=' + APIKey;

	var r = request(queryURL);


	r.on('response', function(res) {
		// Downloads .zip as patientImages.zip at ./papaya/data directory
		console.log("Grabbed images");
		res.pipe(fs.createWriteStream(dataDir + '/patientImages.zip'))
			.on('close', function() {
				unzip(callback);
			});
	});

	function unzip(callback) {
		// Unzips ./papaya/data/patientImages.zip to ./papaya/data/patientData

		var zip = new StreamZip({
			file: dataDir + '/patientImages.zip',
			storeEntries: true
		});

		zip.on('error', function(err) {
			console.log(err);
		});
		zip.on('ready', function() {
		    console.log('Entries read: ' + zip.entriesCount);
		    // extract all 
		    zip.extract(null, './temp/', function(err, count) {
		        console.log('Extracted ' + count + ' entries');
		    });
		});
		zip.on('extract', function(entry, file) {
		    console.log('Extracted ' + entry.name + ' to ' + file);
		});
		zip.on('entry', function(entry) {
		    // called on load, when entry description has been read 
		    // you can already stream this entry, without waiting until all entry descriptions are read (suitable for very large archives) 
		    console.log('Read entry ', entry.name);
		});

		// var extract = onezip.extract(dataDir + '/patientImages.zip', dataDir + '/patientData/');
		// console.log(dataDir + '/patientImages.zip');
		// console.log(dataDir + '/patientData');

		// extract.on('file', (name) => {
		//     console.log("NAME: " + name);
		// });
		 
		// extract.on('start', (percent) => {
		//     console.log('extracting started');
		// });
		 
		// extract.on('progress', (percent) => {
		//     console.log(percent + '%');
		// });
		 
		// extract.on('error', (error) => {
		// 	console.log("ERROR ERROR ERROR");
		//     console.error(error);
		// });
		 
		// extract.on('end', () => {
		//     console.log('done');
		// });

		// Minizip.unzip(dataDir + '/patientImages.zip', dataDir + '/patientData', function(err) {
		//  	if (err) {
		//  		unzip(callback);
		//  	} else {
		// 		console.log('Successful unzip');
		// 		dive(callback); // Loads .dcm files
		// 	}
		// })
	}
}