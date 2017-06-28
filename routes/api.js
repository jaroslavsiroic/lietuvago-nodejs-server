var express = require('express');
var router = express.Router();

var usersRouter = require('./users').router;
var placeRouter = require('./placemarks');

router.get('/', function(req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});

router.use('/users', usersRouter);
router.use('/placemarks', placeRouter);

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
//router.use(tokenCheck);

// ---------------------------------------------------------
// authenticated routes
// ---------------------------------------------------------

router.get('/check', function(req, res) {
    res.json(req.decoded);
});

module.exports = router;
