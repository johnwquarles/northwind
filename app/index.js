var app = require('express')(),
    postgres = require('../lib/postgres'),
    chalk = require('chalk'),
    express = require('express'),
    sassMiddleware = require('node-sass-middleware');

app.set('views', './views');
app.set('view engine', 'jade');
app.use(express.static('public'));

app.use('/css', sassMiddleware({
  src: './views/sass',
  dest: './public/css',
  debug: true,
  outputStyle: 'expanded'
}));

app.get('/', function (req, res) {
  res.render('login', { title: 'Hey', message: 'Hello there!'});
});

function startNodeListener() {
  var port = process.env.PORT || 3000;
  var server = app.listen(port, function () {
    var port = server.address().port;
    var mode = app.get('env');

    console.log(chalk.blue(`\n=== === === `) + chalk.cyan(`Server listening on port ${port} in ${mode} mode...`) + chalk.blue(` === === ===\n`));
  });
}

startNodeListener();
