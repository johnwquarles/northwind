module.exports = function (dbName) {

  var _ = require('lodash'),
      bcrypt = require('bcrypt'),
      pg = require('pg'),
      url = `postgres://localhost:5432/${dbName}`;

  function User(obj) {
    this.username = obj.username;
    this.passwordHash = obj.passwordHash;
  }

  User.findByUsername = function (username, cb) {
    makeQuery("SELECT * FROM users WHERE username = " + username, cb)
  }

  function makeQuery (query, cb) {
    pg.connect(url, function (err, db, done) {
      if (err) throw err;
      db.query(query, function (err, result) {
        if (err) throw err;
        cb(result);
      })
      done();
    })
  }

  return User;

}
