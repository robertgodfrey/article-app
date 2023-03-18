/* practice app to learn node and express */

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

// check connection
db.once('open', () => console.log('Connected to MongoDB'));

// check for db errors
db.on('error', (err) => console.log(err));

// init app
const app = express();

// bring in models
let Article = require('./models/article')

// load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

// home route
app.get('/', async (req, res) => {
  let articles = {};
  try {
    articles = await Article.find();
  } catch (err) {
    console.log(err);
  }
  res.render('index', {
    title: 'Test',
    articles: articles
  });
});

// add articles route
app.get('/articles/add', (req, res) => {
  res.render('add_article', {
    title: 'Add Article'
  });
});

// submit article post route
app.post('/articles/add', async (req, res) => {
  console.log('Article submitted.');
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  try {
    article.save();
  } catch (err) {
    console.log(err);
    return;
  }

  res.redirect('/');
})

// start server
app.listen(3000, () => {
  console.log('Server started on port 3000.');
});

