const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { check, validationResult } = require('express-validator');

const router = express.Router();

const User = require('../models/user');

// register form
router.get('/register', (req, res) => {
  res.render('register');
});

// register post
router.post('/register', [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Email is required').notEmpty(),
    check('email', 'Email is not valid').isEmail(),
    check('username', 'Username is required').notEmpty(),
    check('password', 'Password is required').notEmpty(),
    check('password', 'Confirm Password is required').notEmpty()
  ], async (req, res) => {

  // get errors
  let errors = validationResult(req);

  if (!errors.isEmpty())  {
    res.render('register', {
      errors: errors
    });
  } else {
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const cPassword = req.body.cpassword;

    if (password != cPassword) {
      req.flash('error', 'Passwords don\'t match');
      res.render('register');
    } else {
      let newUser = new User({
        name: name,
        email: email,
        username: username,
        password: password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            console.log(err);
          } else {
            newUser.password = hash;
            try {
              newUser.save();
              req.flash('success', 'Registration successful. Please log in to access your account.');
              res.redirect('/users/login');
            } catch (error) {
              console.log(error);
              return;
            }
          }
        });
      });
    }
  }
});

// login form
router.get('/login', (req, res) => {
  res.render('login');
});

// login process
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  }) (req, res, next);
});

// logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    } else {
      req.flash('success', 'Successfully logged out');
      res.redirect('/');
    }
  });
});

module.exports = router;
