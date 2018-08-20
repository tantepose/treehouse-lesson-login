var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mid = require('../middleware'); // blir index.js, egen middleware

// GET /profile
router.get('/profile', mid.requiresLogin, function(req, res, next) {
  User.findById(req.session.userId) // session, så hent infoen
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        return res.render('profile', {
          title: 'Profile', 
          name: user.name,
          favorite: user.favoriteBook
        });
      }
    })
});

// GET /logout
router.get('/logout', function (req, res, next){
  if (req.session) {
    // slette session
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

// GET /login
router.get('/login', mid.requiresLoggedOut, function (req, res, next) {
  return res.render('login', { title: 'Log in'});
});

// POST /login
router.post('/login', function (req, res, next) {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password');
        err.status = 401;
        return next(err);
      } else { // riktig brukernavn og passord
        req.session.userId = user._id; // unike iden fra mongo fra brukeren vår lager ny session
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('Email and passord required.');
    err.status = 401;
    return next(err);
  }
});

// GET /register
router.get('/register', mid.requiresLoggedOut, function (req, res, next) {
  return res.render('register', { title: 'Sign Up'});
});

// POST /register
router.post('/register', function (req, res, next) {
  // alt fyllt ut?
  if (req.body.email &&
    req.body.name &&
    req.body.favoriteBook &&
    req.body.password &&
    req.body.confirmPassword) {

      // passord-feltene samme?
      if (req.body.password !== req.body.confirmPassword) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        return next(err);
      }

      // lage objektet med form inputen
      var userData = {
        email: req.body.email,
        name: req.body.name,
        favoriteBook: req.body.favoriteBook,
        password: req.body.password,
      }

      // legg objektet inn i mongo om ingen feil
      User.create(userData, function (error, user) {
        if (error) {
          return next(error);
        } else {
          req.session.userId = user._id; // logges inn når bruker laget
          return res.redirect('/profile');
        }
      });

    } else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
});

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

module.exports = router;
