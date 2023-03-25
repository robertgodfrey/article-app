/* practice app to learn node and express */

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

mongoose.connect(config.database);
let db = mongoose.connection;

// check connection
db.once('open', () => console.log('Connected to MongoDB'));

// check for db errors
db.on('error', (err) => console.log(err));

// init app
const app = express();

// bring in models
let Article = require('./models/article');

// load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

// express session
app.use(session({
  secret: 'hehe',
  resave: false,
  saveUninitialized: true,
  cooke: { secure: true }
}));

// express messages
app.use(require('connect-flash')());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// passport config
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// home route
app.get('/', async (req, res) => {
  try {
    res.render('index', {
      title: 'Test',
      articles: await Article.find()
    });
  } catch (err) {
    console.log(err);
  }
});

// route files
let articles = require('./routes/articles');
let users = require('./routes/users');

app.use('/articles', articles);
app.use('/users', users);

// start server
app.listen(3000, () => {
  console.log('Server started on port 3000.');
});

