var express = require('express');
var passport = require('passport');

var router = express.Router();

router.get('/', function (req, res) {
    res.render('auth/index', {
        errorMessages: req.flash('error')
    });
    console.log('auth / oldal');
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/', 
    failureRedirect: '/auth',
    failureFlash: true,
    badRequestMessage: 'Hiányzó adatok'
}));

router.get('/signup', function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/');
    }
    res.render('auth/signup', {
        errorMessages: req.flash('error')
    });
    console.log('auth /signup oldal');
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect:    '/',
    failureRedirect:    '/auth/signup',
    failureFlash:       true,
    badRequestMessage:  'Hiányzó adatok'
}));

router.get('/logout', function(req, res){
    if (!req.isAuthenticated()) {
        res.redirect('/auth');
    }
    var d = new Date();
    console.log('-!-!-!-! logout');
    console.log(req.session);
    req.app.models.user.update({azonosito : req.session.user.azonosito }, {inwork: false, arrival : null}, function(err,recs){console.log(err)});
    req.app.models.worktime.update({id: req.session.wt.id},{dateTo: d},function(err,recs){console.log(err)});
    
    req.session.wt = null;
    req.session.user = null;
    req.logout();
    res.redirect('/');
});

router.get('/edit', function(req,res){
    if (!req.isAuthenticated()) {
        res.redirect('/auth');
    }
    var boss = (req.session.user.role == 'fonok');
    req.session.user.boss = boss;
    console.log(req.session.user);
    res.render('auth/edit', {
        boss: boss,
        errorMessages: req.flash('error')
    });
    console.log('auth /edit oldal');
});

// Módosítás után kijelentkeztet. Visszakell jelentkezni, hogy frissüljenek az adatok
router.post('/edit', function(req,res){
    req.app.models.user.update({azonosito: req.session.user.azonosito},
    {forename: req.body.forename, surname: req.body.surname, role: req.body.role},function(err,recs){console.log(err)});
    
    var d = new Date();
    console.log('-!-!-!-! logout');
    console.log(req.session);
    req.app.models.user.update({azonosito : req.session.user.azonosito }, {inwork: false, arrival : null}, function(err,recs){console.log(err)});
    req.app.models.worktime.update({id: req.session.wt.id},{dateTo: d},function(err,recs){console.log(err)});
    
    req.session.wt = null;
    req.session.user = null;
    
    req.logout();
    
    res.redirect('/');
});

module.exports = router;