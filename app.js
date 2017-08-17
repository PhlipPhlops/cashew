process.chdir(__dirname);

// Dependencies
require('dotenv').config();
var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var ncp = require('ncp').ncp;
var retriever = require('./retriever.js');
var port = process.env.PORT || 3000;

// API Input
var APIKey = process.env.API_KEY;

ncp (__dirname + '/papaya', '/tmp/papaya', function (err) {
	if (err) {
		console.log(err);
	}
	fs.mkdir('/tmp/papaya/data', function() {
		fs.mkdir('/tmp/papaya/data/patientData', function() {
			console.log('Made directories');
		});
	});
});

app.use(express.static('/tmp/papaya'));

// app.use(express.static(__dirname + '/papaya')); //Serves files inside /papaya

// app.get('/:SeriesInstanceUID', function(req, res) {
// 	console.log("SeriesInstanceUID=" + req.params.SeriesInstanceUID);
// 	retriever(req.params.SeriesInstanceUID, APIKey, function() {
// 		// res.sendFile(path.join(__dirname, 'papaya', 'index.html'));
// 		// fs.readFile('/tmp/papaya/imageLoader.js', function(err, data) {
// 		// 	res.send(data);
// 		// })
// 		res.send(fs.readdirSync('/tmp'))
// 	});
// })

app.get('/:SeriesInstanceUID', function(req, res) {
	console.log("SeriesInstanceUID=" + req.params.SeriesInstanceUID);
		retriever(req.params.SeriesInstanceUID, APIKey, function() {
			res.sendFile('/tmp/papaya/index.html');
			// fs.readFile('/tmp/papaya/imageLoader.js', function(err, data) {
			// 	res.send(data);
			// })
			// res.send(fs.readdirSync('/tmp/papaya/data/patientData'))
		});
})

app.get('/', function(req, res) {
	// Testcase
	var SeriesInstanceUID = '1.3.6.1.4.1.14519.5.2.1.2783.4001.810950538899398819772032910724'
	console.log("SeriesInstanceUID=" + SeriesInstanceUID);
	retriever(SeriesInstanceUID, APIKey, function() {
		// res.sendFile(path.join(__dirname, 'papaya', 'index.html'));
		fs.readFile('/tmp/papaya/imageLoader.js', function(err, data) {
			res.send(data);
		})
	});
})

// Non-lambda local server - Comment out when using lambda //
// app.listen(port); // Gives a location for the browser to send requests
// console.log(`Running at port ${port}`);

// Lambda export for lambda handler - Comment out when run locally //
module.exports = app;