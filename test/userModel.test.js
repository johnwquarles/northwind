require('babel/register');

var should = require('chai').should(),
    pg = require('pg'),
    path = require('path');

var dbName = require(path.join(__dirname, '/../lib/dbName')),
    url = 'postgres://localhost:5432/';

describe('Tests', function () {
  it ('are working', function () {
    true.should.equal(true);
  });
});

describe('Database', function () {
  it ('should be open', function (done) {
    // *don't* need quotes around dbName here, even if it has uppercase letters;
    // I checked in the repl.
    pg.connect(url + dbName, function (err, db, close) {
      err && err.message.should.not.equal("connect ECONNREFUSED");
      done();
      close();
    })
  })

  it ('should have a DB with the appropriate name', function (done) {
    pg.connect(url + dbName, function (err, db, close) {
      db.should.not.equal(null);
      done();
      close();
    })
  })
})

describe('User Model', function () {
  var userModel,
      testDBname = 'northwindmock';

  before(function(ready) {
    userModel = require(path.join(__dirname, '/../models/userModel'))(testDBname);
    createTestDB(testDBname, ready);
  });

  it ('should retrieve users with findByUsername', function (done) {
    done();
  });

  after(function(allDone) {
    deleteTestDB(testDBname, allDone);
  });
});

function createTestDB (name, cb) {
  testDBname = name;
  require(path.join(__dirname + '/../lib/postGresSetup'))(name, cb);
}

// I spent at least an hour baffled by why the callback for the DROP DATABASE query wouldn't fire,
// *and* the .on('end', function...) event never fired either.
// Answer, I think: http://www.postgresql.org/docs/8.3/static/wal-async-commit.html
// "Certain utility commands, for instance DROP TABLE, are forced to commit synchronously..."
function deleteTestDB (name, cb) {
  pg.connect(url, function (err, db, close) {
    if (err) {console.log(err.message);}
    db.query('DROP DATABASE "' + name + '";');
    close();
    cb();
  });
}
