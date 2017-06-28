
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config');
var apiRoutes = require('./routes/api');
var userAuth = require('./routes/users').auth;
var User   = require('./models/user');
var tokenCheck = require('./tokencheck');

// =================================================================
// configuration ===================================================
// =================================================================
var port = process.env.PORT || 80; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));
app.use(function(req, res, next) {

	res.set({
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods' : 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
	});
	next();
});

// =================================================================
// routes ==========================================================
// =================================================================

app.get('/', function(req, res) {
	res.send('Hello!');
});

app.post('/reg', function(req, res) {
	if (!(req.body.username && req.body.password)) {
		res.json({ success: false, message: 'You must specify username & password' });
	} else {
		User.findOne({ username: req.body.username}, function(err, dbUser) {
			console.log(dbUser);
			if (dbUser == null) {
				var user = new User({
					username: req.body.username,
					password: req.body.password
				});
				user.save(function(err) {
					if (err) {
						res.json({ success: false, message: err });
					} else {
						console.log('User saved successfully');
						res.json({ success: true });
					}
				});
			} else {
				res.json({ success: false, message: 'username already exists' });
			}
		});
	}
});

app.post('/auth', userAuth);

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------

app.use('/api', tokenCheck, apiRoutes);

// =================================================================
// start the server ================================================
// =================================================================
app.listen(port);
console.log('Magic happens at port ' + port);
