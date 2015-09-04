var pg = require('pg');
var fs = require('fs');
var chalk = require('chalk');

var url = 'postgres://localhost:5432';
var importData = fs.readFileSync(__dirname + '/northwind.postgre.sql').toString();

// bootstrap

pg.connect(url, function(err, db, done) {
  console.log(chalk.yellow("   == Checking for northwind database."));
  if (err) throw err;

  // need user postgres for the import to work.
  db.query('CREATE USER postgres;', function(err) {
    if (!err || err && err.message === 'role "postgres" already exists') {
      done();
    }
    else {
      throw err;
    }
  });

  db.query('CREATE DATABASE northwind;', function(err) {
    if (err && err.message === 'database "northwind" already exists') {
      console.log(chalk.yellow('   == Northwind DB already exists; check complete.'));
    } else {
      console.log(chalk.yellow("   == Northwind DB wasn't found; importing data and creating now."));
      pg.connect(url + "/northwind", function(err, nwdb, nwdone) {
        nwdb.query(importData, function(err) {
          if (err) throw err;
        });
        console.log(chalk.yellow("   == Northwind DB created, import complete; check complete."));
        nwdone();
      })
    }
  });
  done();
});
