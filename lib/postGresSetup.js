var pg = require('pg'),
    fs = require('fs'),
    chalk = require('chalk'),
    importData = fs.readFileSync(__dirname + '/northwind.postgre.sql').toString(),
    url = 'postgres://localhost:5432';

// bootstrap; set up northwind db if none exists & make sure users table exists.
// using callback pattern as such ensures that nothing else happens before the DB is ready.
// IE, this module exports a function that accepts a callback. It will run all the DB setup,
// then fire the callback.
// so in the very first index.js that require-s the rest of the app, we will
// require this module and include the rest of the app as its callback (see the root dir's index.js)
// so that this all definitely happens first.
module.exports = function (cb) {

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
        console.log(chalk.yellow('   == Northwind DB already exists.'));
        checkUsersTable();
      } else {
        console.log(chalk.yellow("   == Northwind DB wasn't found; importing data and creating now."));
        pg.connect(url + "/northwind", function(err, nwdb, nwdone) {
          nwdb.query(importData, function(err) {
            if (err) throw err;
          });
          console.log(chalk.yellow("   == Northwind DB created, import complete."));
          nwdone();
          checkUsersTable();
        })
      }
    });

    done();
  });

  function checkUsersTable() {
    pg.connect(url + "/northwind", function(err, nwdb, nwdone) {
      nwdb.query('CREATE TABLE users(' +
               'id SERIAL PRIMARY KEY NOT NULL, ' +
               'username TEXT NOT NULL, ' +
               'passwordhash TEXT NOT NULL)', function(err) {
        if (err && err.message === 'relation "users" already exists') {
          console.log(chalk.yellow('     == Users table already exists.'));
        } else {
          if (err) {console.log(err.message);};
          console.log(chalk.yellow("     == Users table was created."));
          nwdb.query('ALTER TABLE public.users OWNER TO postgres;', function (err) {if (err) { console.log(err.message); }});
        }
        nwdone();
      });
    })
  }

  cb();
}
