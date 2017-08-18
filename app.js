process.chdir(__dirname);

// Dependencies
require('dotenv').config();
var express = require('express');
var app = express();
var fs = require('fs');
var ncp = require('ncp').ncp;
var retriever = require('./retriever.js');
var empty = require('./empty.js');

// API Input
var APIKey = process.env.API_KEY; // Ensure the .env variable API_KEY is updated with the lambda funciton

app.use(express.static('/tmp/papaya'));

app.get('/:SeriesInstanceUID', function(req, res) { // Triggered on SeriesInstanceUID input
	empty('/tmp/papaya', true, function() { // Ensures /tmp/papaya is deleted from the lambda file system
		ncp (__dirname + '/papaya', '/tmp/papaya', function (err) { // Copies the raw papaya files to the /tmp directory
			if (err) console.log(err);

			fs.mkdir('/tmp/papaya/data', function() { // Creates the destination directories for the incoming files
				console.log('Created data directory');

				retriever(req.params.SeriesInstanceUID, APIKey, function() { // Loads the files in /tmp/papaya/data/patientData to papaya
						
					res.sendFile('/tmp/papaya/index.html'); // Serves papaya's index.html

				});
			});
		});
	});
})

app.get('/', function(req, res) {
	res.send('The root path is currently unhandled. Please append a SeriesInstanceUID to the URL');
})

// Lambda export for lambda handler
module.exports = app;