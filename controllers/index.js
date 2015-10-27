var express = require('express');

var router = express.Router();

router.get('/', function (req, res) {
    req.app.models.user.find().then(function (users) {
        res.render('index', {
            users: users,
            messages: req.flash('info')
        });
    });
    console.log('index oldal');
});

module.exports = router;