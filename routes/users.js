var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var secret = require('../config').secret;
var User = require('../models/user');
var PlaceMark = require('../models/placemark');
// user authenticate



function auth(req, res, next) {
    // find the user
    User.findOne({
        username: req.body.username
    }, function(err, user) {

        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

            // check if password matches
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token,
                    username: user.username
                });
            }

        }

    });
}

//========================
// secured routes
//========================

router.get('/', function(req, res, next) {
    User.findOne({'_id': req.decoded._doc._id}, function(err, users) {
        res.json(users);
    });
});

router.get('/myplacemarks', function(req, res, next) {
    User.findOne({'_id': req.decoded._doc._id}, function(err, user) {
        var places = [];
        for (var i = 0; i < user.visited.length; i++) {
            places.push(user.visited[i].id);
        };

        PlaceMark.find({
            '_id': { $in: places}
        }, function(err, docs){
             res.json(docs);
        });

    });

});

router.put('/addplacemark', function(req, res, next) {

    // check placemark id is valid

    var placemark = req.body.placemarkId;
    //console.log(placemark);
    User.findOneAndUpdate({'_id': req.decoded._doc._id}, {$push: {visited: {id: placemark}}}, function(err, users) {
        if (err) {
            res.json({ success: false, message: 'err accured while saving' });
        } else {
            res.json({ success: true, id: placemark});
        }
    });
});

module.exports = {
    router: router,
    auth: auth
}
