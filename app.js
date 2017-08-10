process.chdir(__dirname);

require('dotenv').config();
var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var retriever = require('./retriever.js');
var port = process.env.PORT || 3000;

//// INPUTS ////
var APIKey = process.env.API_KEY;

app.use(express.static(__dirname + '/papaya')); //Serves files inside /papaya

app.get('/:SeriesInstanceUID', function(req, res) {
	console.log("SeriesInstanceUID=" + req.params.SeriesInstanceUID);
	retriever(req.params.SeriesInstanceUID, APIKey, function() {
		res.sendFile(path.join(__dirname, 'papaya', 'index.html'));
	});
})

// app.listen(port); // Gives a location for the browser to send requests
// console.log(`Running at port ${port}`);

module.exports = app;