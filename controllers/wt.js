var express = require('express');

var router = express.Router();

router.get('/', function (req, res) {
    if (!req.isAuthenticated()) {
        res.redirect('/auth');
    }
    req.app.models.worktime.find({user: req.session.user.id}).then(function (wts) {
        var sumtime = 0;
        var wt;
        console.log('...');
        for (wt in wts) {
            var to = new Date(wts[wt].dateTo);
            var from = new Date(wts[wt].dateFrom);
            console.log(wts);
            sumtime += (to.getTime() - from.getTime());
        }
        sumtime += (new Date()) - (wts[wts.length - 1].dateFrom);
        var x = sumtime / 1000;
        var seconds = Math.floor(x % 60);
        x /= 60;
        var minutes = Math.floor(x % 60);
        x /= 60;
        var hours = Math.floor(x % 24);
        x /= 24;
        var days = Math.floor(x);
        sumtime = days.toString().concat(' nap ');
        sumtime = sumtime.toString().concat(hours.toString().concat(' óra '));
        sumtime = sumtime.toString().concat(minutes.toString().concat(' perc '));
        sumtime = sumtime.toString().concat(seconds.toString().concat(' másodperc'));
        res.render('wt/index', {
            sumtime: sumtime,
            wts: wts,
            messages: req.flash('info')
        });
    });
    console.log('Worktime / oldal');
});

module.exports = router;