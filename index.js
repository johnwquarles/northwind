require('babel/register');

// ensure that DB is ready before anything else happens.
require('./lib/postGresSetup.js')(function() {
  require('./app/');
});
