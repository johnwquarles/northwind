var _ = require('lodash'),
    bcrypt = require('bcrypt'),
    pg = require('pg'),
    url = 'postgres://localhost:5432/northwind';

function User(obj) {
  this.username = obj.username;
  this.passwordHash = obj.passwordHash;
}
