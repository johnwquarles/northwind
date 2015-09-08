var pg = require('pg'),
    fs = require('fs'),
    chalk = require('chalk'),
    importData = fs.readFileSync(__dirname + '/northwind.postgre.sql').toString(),
    url = 'postgres://localhost:5432';

// bootstrap; set up db if none exists & make sure users table exists.
// using callback pattern as such ensures that nothing else happens before the DB is ready.
// IE, this module exports a function that accepts a callback. It will run all the DB setup,
// then fire the callback.
// so in the very first index.js that require-s the rest of the app, we will
// require this module and include the rest of the app as its callback (see the root dir's index.js)
// so that this all definitely happens first.
// the DB operations are asynchronous and call each other in a chain; would like to find a cleaner way to do this.
module.exports = function (dbName, cb) {

  pg.connect(url, function(err, db, done) {
    console.log(chalk.yellow(`   == Checking for ${dbName} database.`));
    if (err) throw err;
    // calls in sequence: userCheck, dbCheck, checkUsersTable.
    userCheck(db, dbName, done, cb);
  });

}

// need user postgres for the import to work.
function userCheck(db, dbName, done, cb) {
  db.query('CREATE USER postgres;', function(err) {
    if (!err || err && err.message === 'role "postgres" already exists') {
      if (!err) {console.log(chalk.yellow(`   == No 'postgres' user existed; creating so that the import will work.`));}
      dbCheck(db, dbName, done, cb);
    }
    else {
      throw err;
    }
  });
}

function dbCheck(db, dbName, done, cb) {
  db.query('CREATE DATABASE "' + dbName + '";', function(err) {
    if (err && err.message === `database "${dbName}" already exists`) {
      console.log(chalk.yellow(`   == ${dbName} DB already exists.`));
      checkUsersTable(dbName, cb);
    } else {
      console.log(chalk.yellow(`   == ${dbName} DB wasn't found; importing data and creating now.`));
      pg.connect(url + "/" + dbName, function(err, nwdb, nwdone) {
        nwdb.query(importData, function(err) {
          if (err) throw err;
        });
        console.log(chalk.yellow(`   == ${dbName} DB created, import complete.`));
        nwdone();
        checkUsersTable(dbName, cb);
      })
    }
    done();
  });
}

function checkUsersTable(dbName, cb) {
  pg.connect(url + "/" + dbName, function(err, nwdb, nwdone) {
    nwdb.query('CREATE TABLE users(' +
             'username TEXT PRIMARY KEY NOT NULL, ' +
             'passwordhash TEXT NOT NULL);', function(err) {
      if (err && err.message === 'relation "users" already exists') {
        console.log(chalk.yellow('   == Users table already exists.'));
      } else {
        if (err) {console.log(err.message);};
        console.log(chalk.yellow("   == Users table was created."));
        nwdb.query('ALTER TABLE public.users OWNER TO postgres;', function (err) {if (err) { console.log(err.message); }});
      }
      nwdone();
      cb();
    });
  })
}
