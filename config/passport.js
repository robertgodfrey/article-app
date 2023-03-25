const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');
const Article = require('../models/article');

module.exports = (passport) => {
  // local strategy
  passport.use(new LocalStrategy( (username, password, done) => {
    User.findOne({ username: username })
        .then(user => {
          if (user) {
            bcrypt.compare(password, user.password, (err, match) => {
              if (err) {
                console.log(err);
              } else if (match) {
                return done(null, user);
              } else {
                return done(null, false, { message: 'Username/password incorrect' });
              }
            });
          } else {
            return done(null, false, { message: 'Username/password incorrect' });
          }
        })
        .catch (err => {
          console.log(err);
          return done(null, false, { message: 'Username/password incorrect' });
        });
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then((user, err) => {
        done(err, user);
      })
      .catch(err => {
        console.log(err);
      });
  });
}
