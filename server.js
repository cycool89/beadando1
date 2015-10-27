process.env.TZ = 'Europe/Budapest';

var app = require('./Application/app');

app.setMiddlewares();

app.setEndPoints();

app.start();