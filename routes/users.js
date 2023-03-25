const express = require('express');
const bcrypt = require('bcryptjs');
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
      // TODO
      console.log('Passwords don\'t match!');
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
            } catch (err) {
              console.log(err);
              return;
            }
          }
        });
      });
    }
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});

module.exports = router;
