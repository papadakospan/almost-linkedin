// Include Packages
const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require('morgan');
const fs = require('fs');
const https = require('https');

// Server Configuration
const config = require('./config');
const httpsOptions = {
	key: fs.readFileSync('./certs/selfsigned.key'),
	cert: fs.readFileSync('./certs/selfsigned.crt')
};

// Initialize the application
var server = express();
server.use(cors());
server.use(logger('dev'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(config.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
mongoose.connection.on('error', err => {
	console.log('Could not connect to MongoDB');
});

// Allowed headers
server.use((req, res, next) => {
	res.header(
		"Access-Control-Allow-Headers",
		"x-access-token, Origin, Content-Type, Accept"
	);
	next();
});

// Set API endpoint routes
server.use('/users', require('./routes/user.routes'));
server.use('/admin', require('./routes/admin.routes'));

// Start the server (HTTPS)
https.createServer(httpsOptions, server).listen(config.LISTEN_PORT, () => {
	console.log("Listening on port " + config.LISTEN_PORT);
});
