// Takes a SeriesInstanceUID and an API Key as inputs and returns a .zip
// of whatever images the TCIA database returns
var request = require('request');
var fs = require('fs');
var unzipper = require('unzip-stream');
var path = require('path');
var empty = require('./empty'); 
var dive = require('./diver'); // Loads all .dcm files after download

module.exports = function retriever(SeriesInstanceUID, APIKey, callback) {
	if (SeriesInstanceUID == 'favicon.ico') {
		return;
	}
	var dataDir = '/tmp/papaya/data'
	empty(dataDir); // Empties /tmp/patientData/

	var baseURL = 'http://services.cancerimagingarchive.net/services/v4';
	var queryURL = baseURL + '/TCIA/query/getImage?SeriesInstanceUID=' + SeriesInstanceUID + '&api_key=' + APIKey;

	var r = request(queryURL);


	r.on('response', function(res) {
		// Downloads .zip as patientImages.zip at ./papaya/data directory


		console.log("Grabbed images");
		res.pipe(fs.createWriteStream(dataDir + '/patientImages.zip'))
			.on('close', function() {
				fs.mkdir(dataDir + '/patientData', function() {
					unzip(callback);
				})
			});
	});

	function unzip(callback) {
		// Unzips ./papaya/data/patientImages.zip to ./papaya/data/patientData
		fs.createReadStream(dataDir + '/patientImages.zip')
			.pipe(unzipper.Extract({ path: dataDir + '/patientData' }))
			.on('close', function() {
				dive(callback);
			});
	}
}