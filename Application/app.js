var express = require('express');
var Waterline = require('waterline');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

function Application() {
    this.port = process.env.PORT;
    this.host = process.env.IP;
}

var beadando = new Application();
beadando.app = express();
beadando.orm = new Waterline();
beadando.orm.loadCollection(Waterline.Collection.extend(require('../models/worktime')));
beadando.orm.loadCollection(Waterline.Collection.extend(require('../models/user')));

beadando.hbs = require('hbs');

var blocks = {};

beadando.hbs.registerHelper('extend', function(name, context) {
    var block = blocks[name];
    if (!block) {
        block = blocks[name] = [];
    }

    block.push(context.fn(this));
});

beadando.hbs.registerHelper('dateFormat', function(context, block) {
    var str = '';
    var d = new Date(context);
    if(parseInt(d.getFullYear()) >= 2000){
        str = str.concat(d.getFullYear().toString());
        str = str.concat('.');
        str = str.concat(d.getMonth() + 1);
        str = str.concat('.');
        str = str.concat(d.getDate().toString());
        str = str.concat(' ');
        str = str.concat(d.getHours().toString());
        str = str.concat(':');
        str = str.concat(d.getMinutes().toString());
        str = str.concat(':');
        str = str.concat(d.getSeconds().toString());
    } else {
        str = 'Nem dolgozik';
    }
    return str;
});

beadando.hbs.registerHelper('block', function(name) {
    var val = (blocks[name] || []).join('\n');

    // clear the block
    blocks[name] = [];
    return val;
});

beadando.app.set('views', './views');
beadando.app.set('view engine', 'hbs');

beadando.waterlineConfig = require('../config/waterline');

// ----------------------- Controllers

beadando.controllers = [];
beadando.controllers['index'] = require("../controllers/index");
beadando.controllers['auth'] = require("../controllers/auth");
beadando.controllers['wt'] = require("../controllers/wt");
    
// ----------------------

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// Local Strategy for sign-up
passport.use('local-signup', new LocalStrategy({
        usernameField: 'azonosito',
        passwordField: 'password',
        passReqToCallback: true,
    },   
    function(req, azonosito, password, done) {
        var d = new Date();
        req.app.models.user.findOne({ azonosito: azonosito }, function(err, user) {
            if (err) { return done(err); }
            if (user) {
                return done(null, false, { message: 'Létező felhasználó.' });
            }
            req.body.arrival = d;
            req.app.models.user.create(req.body)
            .then(function (user) {
                req.app.models.worktime.create({dateFrom: d, dateTo: d, user: user})
                .then(function (wt) {
                    req.session.wt = wt;
                    req.session.user = user;
                    return done(null, user);
                })
                .catch(function (err) {
                    console.log(err);
                });
            })
            .catch(function (err) {
                return done(null, false, { message: err.details });
            });
        });
    }
));

// Stratégia
passport.use('local', new LocalStrategy({
        usernameField: 'azonosito',
        passwordField: 'password',
        passReqToCallback: true,
    },
    function(req, azonosito, password, done) {
        var d = new Date();
        req.app.models.user.findOne({ azonosito: azonosito }, function(err, user) {
            if (err) { return done(err); }
            if (!user || !user.validPassword(password)) {
                return done(null, false, { message: 'Helytelen adatok.' });
            }
        });
        req.app.models.user.update({azonosito : azonosito }, {inwork: true, arrival : d}, function(err,recs){console.log(err)});
        req.app.models.user.findOne({ azonosito: azonosito }, function(err, user) {
            console.log(err);
            req.app.models.worktime.create({dateFrom: d, dateTo: d, user: user})
            .then(function (wt) {
                req.session.wt = wt;
                req.session.user = user;
                return done(null, user);
            })
            .catch(function (err) {
                console.log(err);
            });
        });
    }
));
    
// ----------------------- Middleware segédfüggvény

function setLocalsForLayout() {
    return function (req, res, next) {
        res.locals.loggedIn = req.isAuthenticated();
        res.locals.user = req.user;
        next();
    };
}
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/auth');
}
function andRestrictTo(role) {
    return function(req, res, next) {
        if (req.user.role == role) {
            next();
        } else {
            next(new Error('Unauthorized'));
        }
    };
}    
    
// ------------------------ Middlewarek

beadando.setMiddlewares = function () {
    beadando.app.use(express.static('public'));
    beadando.app.use(bodyParser.urlencoded({ extended: false }));
    beadando.app.use(expressValidator());
    beadando.app.use(session({
        cookie: { maxAge: 600000 },
        secret: 'titkos szoveg',
        resave: true,
        saveUninitialized: false,
    }));
    beadando.app.use(flash());
    beadando.app.use(passport.initialize());
    beadando.app.use(passport.session());
    
    beadando.app.use(setLocalsForLayout());  
};
    
// ------------------------ Endpoints

beadando.setEndPoints = function() {
    var key;
    for (key in beadando.controllers) {
        if (key == 'index') {
            beadando.app.use('/', beadando.controllers[key]);
        } else {
            beadando.app.use('/'.concat(key), beadando.controllers[key]);
        }
    }
    
    beadando.app.get('/reset',function(req,res){
        var key;
        for (key in beadando.app.models) {
            beadando.app.models[key].drop();
        }
        res.redirect('/');
    });
};
    
// ------------------------ Server start

beadando.start = function () {
    beadando.orm.initialize(beadando.waterlineConfig, function(err, models) {
        if(err) throw err;
        
        beadando.app.models = models.collections;
        beadando.app.connections = models.connections;
        
        beadando.server = beadando.app.listen(beadando.port, beadando.host, function() {
            console.log('Server is started.');
        });
        
        console.log("ORM is started.");
    });
};

module.exports = beadando;