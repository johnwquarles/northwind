var app = require('express')();
var postgres = require('../lib/postgres');
var chalk = require('chalk');

function startNodeListener() {
  var server = app.listen(app.get('port'), function () {
    var port = server.address().port;
    var mode = app.get('env');

    chalk.blue('hello');
    console.log(chalk.blue(`\n=== === === `) + chalk.cyan(`Server listening on port ${port} in ${mode} mode...`) + chalk.blue(` === === ===\n`));
  });
}

startNodeListener();
