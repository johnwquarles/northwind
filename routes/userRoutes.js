var express = require('express'),
    router = express.Router(),
    userModel = require('../models/userModel');

router
  .get('/login', function (req, res) {
    req.session.regenerate(function () {
      res.render('login', { title: 'Login'});
    })
  })

  .get('/newUser', function (req, res) {
    req.session.regenerate(function () {
      res.render('newUser', { title: 'Create Account'});
    });
  });

module.exports = router;
