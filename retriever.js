// Takes a SeriesInstanceUID and an API Key as inputs and returns a .zip
// of whatever images the TCIA database returns
var request = require('request');
var fs = require('fs');
var unzipper = require('unzip-stream');
var path = require('path');
var dive = require('./diver'); // Loads all .dcm files after download

module.exports = function retriever(SeriesInstanceUID, APIKey, callback) {
	if (SeriesInstanceUID == 'favicon.ico') {
		return;
	}
	var dataDir = '/tmp/papaya/data' // Destination directory for incoming files

	var baseURL = 'http://services.cancerimagingarchive.net/services/v4'; // TCIA API url
	var queryURL = baseURL + '/TCIA/query/getImage?SeriesInstanceUID=' + SeriesInstanceUID + '&api_key=' + APIKey;

	var r = request(queryURL); // Makes a request to the TCIA /getImage API with the specified queries

	r.on('response', function(res) {
		// On response from TCIA, downloads a .zip of the data before unzipping it
		console.log("Got response from TCIA");

		res.pipe(fs.createWriteStream(dataDir + '/patientImages.zip')) // Pipes incoming data to /patientImages.zip
			.on('close', function() { // When the pipe is finshed, continues
				fs.mkdir(dataDir + '/patientData', function() { // Creates destination folder for unzipped files
					unzip(callback); // Begins unzip
				})
			});
	});

	function unzip(callback) {
		// Unzips /patientImages.zip into /patientData directory
		fs.createReadStream(dataDir + '/patientImages.zip') // Input file for unzip
			.pipe(unzipper.Extract({ path: dataDir + '/patientData' })) // Pipes to /patientData directory
			.on('close', function() { // When finished, calls dive to load the file paths to papaya
				dive(callback);
			});
	}
}