require('babel/register');

var path = require('path'),
    dbName = require(path.join(__dirname, 'lib/dbName'));

// ensure that DB is ready before anything else happens; set db name to northwind.
require(path.join(__dirname, 'lib/postGresSetup.js'))(dbName, function() {
  require(path.join(__dirname, "app/"));
});
