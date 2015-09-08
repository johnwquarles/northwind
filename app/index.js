var app = require('express')(),
    bodyParser = require('body-parser'),
    chalk = require('chalk'),
    express = require('express'),
    session = require('express-session'),
    path = require('path');

var dbName = require(path.join(__dirname, '/../lib/dbName')),
    userModel = require(path.join(__dirname, '../models/userModel'))(dbName),
    userRoutes = require(path.join(__dirname, '../routes/userRoutes'));

app.set('views', path.join(__dirname, '/../views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, '/../public')));
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
  secret: 'ihopedubstepneverends',
  resave: false,
  saveUninitialized: true
}));

app.use(function setResLocalsUser(req, res, next) {
  res.locals.user = req.session.user || null;
  next();
});

app.use('/', userRoutes);

// route to app is protected using the ternary below so that nonsense routes
// will properly 404 instead of redirecting to login.

app.get('/', function (req, res) {
  req.session.user ?
    res.render('app', { title: 'Welcome to Northwind DataPlexPrime'}):
    res.redirect('/login');
})

// ========= Errors =========

app
  .use(function (req, res, next) {
    res.status(404).send('This page does not exist');
  })
  .use(function (err, req, res, next) {
    console.log('error', err.stack);
    res.status(500).send('An error has occurred.');
  });

// ========= Server =========

function startNodeListener() {
  var port = process.env.PORT || 3000;
  var server = app.listen(port, function () {
    var port = server.address().port;
    var mode = app.get('env');

    console.log(chalk.blue(`\n=== === === `) + chalk.cyan(`Server listening on port ${port} in ${mode} mode...`) + chalk.blue(` === === ===\n`));
  });
}

startNodeListener();
