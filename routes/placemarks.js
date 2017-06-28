var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var secret = require('../config').secret;
var Placemark = require('../models/placemark');

//========================
// secured routes
//========================


router.get('/', function(req, res, next) {
    if (req.query.id) {
        Placemark.findById(req.query.id, function(err, place) {
            res.json(place);
        });
    } else {
        // if params.id then findById else find
        Placemark.find({}, {"name": 1, "style": 1, "latitude": 1, "longitude": 1, "image": 1, "description": 1}, function(err, places) {
            res.json(places);
        });
    }
});

module.exports = router;
